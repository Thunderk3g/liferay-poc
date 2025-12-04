import express from 'express';
import proxyMiddleware from 'express-http-proxy';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API requests
app.use(
  '/o/headless-delivery',
  proxyMiddleware('http://liferay-portal-ce:8080', {
    proxyReqOptDecorator: (proxyReqOpts) => {
      proxyReqOpts.headers['Authorization'] =
        'Basic ' + Buffer.from('test@liferay.com:test').toString('base64');
      return proxyReqOpts;
    },
  })
);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Running at http://0.0.0.0:${PORT}`);
});
