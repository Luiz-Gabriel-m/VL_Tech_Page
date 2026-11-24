import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function parseArgs(argv) {
  let port = Number(process.env.PORT) || 3000;
  let host = process.env.HOST || '';

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if ((arg === '--port' || arg === '-p') && argv[i + 1]) {
      const parsed = Number(argv[++i]);
      if (Number.isInteger(parsed) && parsed > 0) port = parsed;
    } else if (arg.startsWith('--port=')) {
      const parsed = Number(arg.slice('--port='.length));
      if (Number.isInteger(parsed) && parsed > 0) port = parsed;
    } else if (arg === '--host' && argv[i + 1] && !argv[i + 1].startsWith('-')) {
      host = argv[++i];
    } else if (arg.startsWith('--host=')) {
      host = arg.slice('--host='.length);
    }
  }

  return { port, host };
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const { port: initialPort, host: configuredHost } = parseArgs(process.argv.slice(2));
const MAX_PORT_RETRIES = 20;

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  let safePath;
  try {
    safePath = decodeURIComponent(urlPath);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  let filePath = path.join(ROOT_DIR, safePath === '/' ? 'index.html' : safePath);
  filePath = path.normalize(filePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      });
      res.end(data);
    });
  });
});

let currentPort = initialPort;
let retries = 0;

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE' && retries < MAX_PORT_RETRIES) {
    retries += 1;
    currentPort += 1;
    startListening(currentPort);
    return;
  }
  console.error('[dev-server] Failed to start:', err);
  process.exit(1);
});

server.on('listening', () => {
  const addr = server.address();
  const activePort = typeof addr === 'object' && addr ? addr.port : currentPort;
  console.log(`\n  VL Tech dev server ready\n`);
  console.log(`  ➜  Local:   http://localhost:${activePort}/`);
  console.log(`  ➜  Network: http://127.0.0.1:${activePort}/\n`);
});

function startListening(port) {
  if (configuredHost) {
    server.listen(port, configuredHost);
  } else {
    // Dual-stack default: accepts both IPv6 (::1) and IPv4 (127.0.0.1) for localhost
    server.listen(port);
  }
}

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 500).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startListening(currentPort);
