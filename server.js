const express = require('express');
const client = require('prom-client');

const app = express();
client.collectDefaultMetrics();

const hits = new client.Counter({
  name: 'api_hello_requests_total',
  help: 'Total /api/hello calls',
});

let calls = 0;

app.get('/api/hello', (req, res) => {
  hits.inc();
  calls += 1;
  res.json({ message: 'Hello from the Node.js backend!', calls });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
