import express from 'express';
import { createProxyMiddleware } from 'express-http-proxy';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API requests to Liferay
app.use(
  '/o/headless-delivery',
  createProxyMiddleware({
    target: process.env.VITE_API_BASE_URL || 'http://liferay:8080',
    changeOrigin: true,
    secure: false,
    headers: {
      'Authorization': 'Basic ' + Buffer.from('test@liferay.com:test').toString('base64'),
    },
    pathRewrite: {
      '^/o/headless-delivery': '/o/headless-delivery',
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy error', details: err.message });
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
