# Northstar Retail Co. — Webhook Refactor Reference (Days 4–5)

## Purpose

This document preserves the **Northstar Retail Co. inventory** response to the original polling-to-webhook requirement. It is intentionally kept separate from the later **Solstice Events Co. Pivot Event**, which is implemented as a runnable MVP under `pivot-event/solstice-events-co/`.

## Complete Server Code

The implementation below shows the Northstar inventory webhook model. The scheduled polling mechanism is removed from the active update path. Incoming inventory events are authenticated with HMAC-SHA256 before the cache is updated.

```javascript
// Required modules
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// Simulated warehouse data representing Northstar's inventory.
const inventory = [
  { item_id: 'NSJ001', name: 'Sovereign Shearling Trench', stock: 40, status: 'IN STOCK' },
  { item_id: 'NSJ002', name: 'Imperial Velvet Evening Blazer', stock: 30, status: 'IN STOCK' },
  { item_id: 'NSS001', name: 'Monarch Chunky Cable Sweater', stock: 50, status: 'IN STOCK' },
  { item_id: 'NSS002', name: 'Celestial Turtleneck Knit', stock: 40, status: 'IN STOCK' },
  { item_id: 'NSC001', name: 'Aura Lounge Hoodie & Pants Set', stock: 60, status: 'IN STOCK' },
  { item_id: 'NSC002', name: 'Ethereal Track Set in Rose Gold', stock: 0, status: 'OUT OF STOCK' }
  // Remaining inventory items are retained in the original prototype data.
];

let cache = {};
let webhookEventLog = [];

function validateSignature(req, res, next) {
  const receivedSignature = req.headers['x-signature'];
  const secret = process.env.WEBHOOK_SECRET;

  if (!receivedSignature || !secret) return res.sendStatus(401);

  const payload = JSON.stringify(req.body);
  const calculatedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  if (receivedSignature !== calculatedSignature) {
    return res.sendStatus(401);
  }

  next();
}

// Day 4 pivot: warehouse pushes inventory updates instead of being polled.
app.post('/webhook/inventory-update', validateSignature, (req, res) => {
  const { item_id, stock, status, timestamp } = req.body;

  if (!item_id || typeof stock !== 'number' || !status || !timestamp) {
    return res.status(400).json({ error: 'Invalid payload structure' });
  }

  cache[item_id] = { stock, status };
  webhookEventLog.unshift({ item_id, stock, status, timestamp });
  webhookEventLog = webhookEventLog.slice(0, 10);

  return res.sendStatus(200);
});

app.get('/webhook/log', (_req, res) => {
  res.status(200).json(webhookEventLog);
});

// Existing stock query behavior remains available against the webhook-fed cache.
app.get('/stock/:item_id', (req, res) => {
  const itemId = req.params.item_id;
  const itemStock = cache[itemId];

  if (!itemStock) return res.status(404).json({ error: 'Item not found' });
  res.status(200).json({ item_id: itemId, ...itemStock });
});

app.get('/stock/all', (_req, res) => {
  res.status(200).json(cache);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Northstar webhook service running on http://localhost:${PORT}`);
});
```

## Expected Usage

1. Set a shared `WEBHOOK_SECRET` in the environment.
2. Start the Node.js/Express service.
3. Send an authenticated `POST /webhook/inventory-update` event.
4. Query the updated cache through `GET /stock/:item_id` or `GET /stock/all`.
5. Inspect recent webhook events through `GET /webhook/log`.

Example payload:

```json
{
  "item_id": "NSJ001",
  "stock": 35,
  "status": "IN STOCK",
  "timestamp": "2026-08-19T12:00:00Z"
}
```

## Important distinction from the later Pivot Event

The Northstar pivot is an **inventory synchronization** scenario. The later Pivot Event handout introduces **Solstice Events Co.**, where the application is an event check-in kiosk and the asynchronous flow is specifically:

`QR scan → print request/queue → badge printer → signed webhook → confirmed check-in`

That later scenario requires duplicate-scan protection, replay protection, out-of-order job matching, and a pending UI state. Its runnable implementation is therefore kept in `pivot-event/solstice-events-co/` instead of being mixed into the Northstar inventory code.
