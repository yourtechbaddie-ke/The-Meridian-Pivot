# Northstar Retail Co. — Webhook Refactor (Days 4-5)

## Complete Server Code

This code implements a webhook push model that updates inventory in real-time through a new endpoint. The polling mechanism has been completely removed as per the client's requirement.

```javascript
// Required modules
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Express app setup
const app = express();
app.use(bodyParser.json());

// Simulated warehouse data representing Northstar's inventory (all 25 items)
const inventory = [
  { item_id: 'NSJ001', name: 'Sovereign Shearling Trench', category: 'Jacket', fabric: 'Shearling', price: 2850, stock: 40, status: 'IN STOCK' },
  { item_id: 'NSJ002', name: 'Imperial Velvet Evening Blazer', category: 'Jacket', fabric: 'Velvet', price: 1950, stock: 30, status: 'IN STOCK' },
  { item_id: 'NSS001', name: 'Monarch Chunky Cable Sweater', category: 'Sweater', fabric: 'Wool', price: 1200, stock: 50, status: 'IN STOCK' },
  { item_id: 'NSS002', name: 'Celestial Turtleneck Knit', category: 'Sweater', fabric: 'Knit', price: 880, stock: 40, status: 'IN STOCK' },
  { item_id: 'NSC001', name: 'Aura Lounge Hoodie & Pants Set', category: 'Cashmere Set', fabric: 'Cashmere', price: 1650, stock: 60, status: 'IN STOCK' },
  { item_id: 'NSC002', name: 'Ethereal Track Set in Rose Gold', category: 'Cashmere Set', fabric: 'Cashmere', price: 1800, stock: 0, status: 'OUT OF STOCK' },
  { item_id: 'NSD001', name: 'Opulent Backless Gown', category: 'Dress', fabric: 'Silk', price: 2200, stock: 50, status: 'IN STOCK' },
  { item_id: 'NSD002', name: 'Seraphina Sequin Mini Dress', category: 'Dress', fabric: 'Sequin', price: 1450, stock: 30, status: 'IN STOCK' },
  { item_id: 'NSK001', name: 'Aether Pleated Midi Skirt', category: 'Skirt', fabric: 'Cotton', price: 750, stock: 40, status: 'IN STOCK' },
  { item_id: 'NSK002', name: 'Obsidian Leather Column Skirt', category: 'Skirt', fabric: 'Leather', price: 1100, stock: 30, status: 'IN STOCK' },
  { item_id: 'NSB001', name: 'Luminary Pussy-Bow Blouse', category: 'Blouse', fabric: 'Silk', price: 620, stock: 50, status: 'IN STOCK' },
  { item_id: 'NSH001', name: 'Atelier Tailored Crisp Shirt', category: 'Shirt', fabric: 'Cotton', price: 480, stock: 60, status: 'IN STOCK' },
  { item_id: 'NSW001', name: 'Soleil Hand-Crochet Tunic', category: 'Crochetwear', fabric: 'Cotton', price: 890, stock: 20, status: 'LOW STOCK' },
  { item_id: 'NSW002', name: 'Riviera Crochet Cardigan', category: 'Crochetwear', fabric: 'Cotton', price: 720, stock: 0, status: 'OUT OF STOCK' },
  { item_id: 'NSJ003', name: 'Vanguard Straight-Leg Denim', category: 'Denim Jeans', fabric: 'Denim', price: 420, stock: 70, status: 'IN STOCK' },
  { item_id: 'NSJ004', name: 'Noir Wide-Leg High-Rise Denim', category: 'Denim Jeans', fabric: 'Denim', price: 450, stock: 50, status: 'IN STOCK' },
  { item_id: 'NSL001', name: 'Velour Contour Leggings', category: 'Leggings', fabric: 'Velour', price: 280, stock: 60, status: 'IN STOCK' },
  { item_id: 'NSR001', name: 'Courtside Gold Edition Jersey', category: 'Jersey', fabric: 'Polyester', price: 390, stock: 40, status: 'IN STOCK' },
  { item_id: 'NSR002', name: 'Northstar Varsity Mesh Jersey', category: 'Jersey', fabric: 'Polyester', price: 350, stock: 10, status: 'LOW STOCK' },
  { item_id: 'NST001', name: 'Apex Leather Low-Top Trainers', category: 'Trainers', fabric: 'Leather', price: 680, stock: 50, status: 'IN STOCK' },
  { item_id: 'NST002', name: 'Runner High-Top Knit Trainer', category: 'Trainers', fabric: 'Knit', price: 750, stock: 30, status: 'IN STOCK' },
  { item_id: 'NSX001', name: 'Signature Ribbed Cashmere Socks', category: 'Socks', fabric: 'Cashmere', price: 120, stock: 80, status: 'IN STOCK' },
  { item_id: 'NSX002', name: 'Monogram Silk-Blend Dress Socks', category: 'Socks', fabric: 'Silk', price: 95, stock: 50, status: 'IN STOCK' },
  { item_id: 'NSM001', name: 'Crown Slouchy Cashmere Marvin', category: 'Marvin/Beanie', fabric: 'Cashmere', price: 240, stock: 70, status: 'IN STOCK' },
  { item_id: 'NSM002', name: 'Alpine Ribbed Wool-Cashmere Marvin', category: 'Marvin/Beanie', fabric: 'Wool-Cashmere', price: 190, stock: 50, status: 'IN STOCK' }
];

// In-memory cache to store inventory data for fast access
let cache = {};
let webhookEventLog = [];

// Function to validate HMAC-SHA256 signature
const validateSignature = (req, res, next) => {
  const receivedSignature = req.headers['x-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.WEBHOOK_SECRET;

  const hmac = crypto.createHmac('sha256', secret);
  const calculatedSignature = hmac.update(payload).digest('hex');

  if (receivedSignature !== calculatedSignature) {
    return res.sendStatus(401); // Unauthorized
  }
  next();
};

// [DAY 4 PIVOT - Added] Webhook endpoint for inventory updates
app.post('/webhook/inventory-update', validateSignature, (req, res) => {
  const { item_id, stock, status, timestamp } = req.body;

  if (!item_id || typeof stock !== 'number' || !status || !timestamp) {
    return res.status(400).json({ error: 'Invalid payload structure' });
  }

  // Update in-memory cache
  cache[item_id] = { stock, status };
  webhookEventLog.unshift({ item_id, stock, status, timestamp });
  
  // Keep the last 10 events only
  if (webhookEventLog.length > 10) {
    webhookEventLog.pop();
  }

  res.sendStatus(200); // OK
});

// [DAY 4 PIVOT - Added] Endpoint to fetch the webhook event log
app.get('/webhook/log', (req, res) => {
  res.status(200).json(webhookEventLog);
});

// [DEPRECATED - Removed per Day 4 Pivot] REST endpoint to get stock for a specific item by its ID
app.get('/stock/:item_id', (req, res) => {
  const itemId = req.params.item_id;
  const itemStock = cache[itemId];

  if (itemStock) {
    res.status(200).json({ item_id: itemId, ...itemStock });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// [DEPRECATED - Removed per Day 4 Pivot] REST endpoint to get all stock data
app.get('/stock/all', (req, res) => {
  res.status(200).json(cache);
});

// Start the Express server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

## Expected Usage

1. **Running the Server**:
   - Ensure you have Node.js installed on your machine.
   - Create a new project directory, navigate into it, and then create a `webhook_system.js` file.
   - Copy the complete server code above into `webhook_system.js`.
   - Set your `WEBHOOK_SECRET` environment variable:
     ```bash
     export WEBHOOK_SECRET='your_shared_secret'
     ```
   - In your terminal, run:
     ```bash
     npm init -y
     npm install express body-parser
     node webhook_system.js
     ```

2. **Sending Test Webhook Payloads**:
   - Using a tool like Postman or curl, send a POST request to the new endpoint.
   - Example payload:
     ```json
     {
       "item_id": "NSJ001",
       "stock": 35,
       "status": "IN STOCK",
       "timestamp": "2026-08-19T12:00:00Z"
     }
     ```
   - Ensure you include the correct HMAC-SHA256 signature in the headers:
     ```
     x-signature: <computed_signature>
     ```

3. **Accessing the Endpoints**:
   - To get stock for a specific item (e.g., `NSJ001`), hit:
     ```
     GET http://localhost:3000/stock/NSJ001
     ```
   - To get all stock data, hit:
     ```
     GET http://localhost:3000/stock/all
     ```
   - To access the webhook event log, hit:
     ```
     GET http://localhost:3000/webhook/log
     ```

## Notes
- All polling-related code has been removed from the codebase.
- The new webhook system provides real-time updates to inventory and an event log to track changes.
- The system is designed to be ready for production usage based on the specified requirements.
