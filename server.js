const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'datapulse-backend', version: '8.0', ts: Date.now() });
});

// Health endpoints (hunda)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime(), ts: Date.now() });
});
app.get('/health_check', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/ping', (req, res) => res.send('pong'));

// Sync endpoints
app.post('/api/sync/bulk', (req, res) => {
  const body = req.body || {};
  console.log('📥 Bulk sync:', Object.keys(body).map(k => `${k}:${Array.isArray(body[k]) ? body[k].length : 0}`).join(', '));
  res.json({ ok: true, received: true, ts: Date.now() });
});
app.post('/api/sync/op', (req, res) => {
  console.log('📥 Sync op:', req.body?.kind, req.body?.op);
  res.json({ ok: true });
});

// Email endpoint
app.post('/api/send-email', (req, res) => {
  console.log('📧 Email request to:', req.body?.to);
  res.json({ ok: true, queued: true });
});

// Webhook endpoint
app.post('/hook/:apiKey', (req, res) => {
  console.log('🔗 Webhook hit:', req.params.apiKey);
  res.json({ ok: true, ts: Date.now() });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ DataPulse Backend v8.0 running on port ' + PORT);
});
