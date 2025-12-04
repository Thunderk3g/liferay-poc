import express from 'express';
import proxyMiddleware from 'express-http-proxy';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware to rewrite Host header for Liferay
app.use((req, res, next) => {
  req.headers.host = 'localhost:8080';
  next();
});

// Proxy API requests to Liferay
// Use container name for internal Docker networking
app.use(
  '/o/headless-delivery',
  proxyMiddleware('http://liferay-portal-ce:8080', {
    headers: {
      'Authorization': 'Basic ' + Buffer.from('test@liferay.com:admin').toString('base64'),
    },
  })
);

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Frontend server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Proxying API to: ${process.env.VITE_API_BASE_URL || 'http://liferay:8080'}`);
});
