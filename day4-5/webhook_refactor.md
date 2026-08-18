# Northstar Retail Co. — Webhook Refactor (Days 4-5)

## Full Server/App Code

```javascript
// Importing necessary modules
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// In-memory cache to store stock data
const stockCache = {};

// Webhook event log
const webhookLog = [];

// Mock warehouse API data (Northstar inventory)
const warehouseData = [
  // (same data as in original code)
];

// Webhook Secret
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// [DEPRECATED - Removed per Day 4 Pivot]
// Function to poll the warehouse API (mock data source here)
// const pollWarehouseAPI = () => {
//   console.log("Polling warehouse API for stock updates...");
//   warehouseData.forEach(item => {
//     stockCache[item.item_id] = {
//       name: item.name,
//       category: item.category,
//       price: item.price,
//       stock: item.stock,
//       status: item.stock > 0 ? (item.stock < 20 ? "LOW STOCK" : "IN STOCK") : "OUT OF STOCK"
//     };
//   });
//   console.log("Warehouse stock cache updated.");
// };

// [DEPRECATED - Removed per Day 4 Pivot]
// Polling every 5 minutes (300,000 milliseconds)
// const pollingInterval = setInterval(pollWarehouseAPI, 300000);
// [DEPRECATED - Removed per Day 4 Pivot] // Initial call to populate the cache immediately upon startup
// pollWarehouseAPI();

// Endpoint to handle webhook for inventory updates
app.post('/webhook/inventory-update', (req, res) => {
  const { item_id, name, stock, status, timestamp, signature } = req.body;

  // Validate signature
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const computedSignature = hmac.update(JSON.stringify(req.body)).digest('hex');

  if (computedSignature !== signature) {
    return res.status(401).json({ message: 'Unauthorized' }); // Invalid signature
  }

  // Update the stock cache
  stockCache[item_id] = {
    name,
    stock,
    status,
    updatedAt: timestamp
  };

  // Log the webhook event
  webhookLog.unshift({ item_id, stock, status, timestamp });
  if (webhookLog.length > 10) {
    webhookLog.pop(); // Keep only the last 10 events
  }

  console.log(`Received webhook update for item ${item_id}`);
  return res.status(200).json({ message: 'Stock updated successfully' });
});

// Endpoint to get stock data for a specific item by item_id
app.get('/stock/:item_id', (req, res) => {
  const item_id = req.params.item_id;
  const stockData = stockCache[item_id];

  if (stockData) {
    return res.json(stockData);
  } else {
    return res.status(404).json({ message: "Item not found" });
  }
});

// Endpoint to get cached stock data for all items
app.get('/stock/all', (req, res) => {
  return res.json(Object.values(stockCache));
});

// Endpoint to access the webhook event log
app.get('/webhook/log', (req, res) => {
  return res.json(webhookLog);
});

// Start the express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

## Mock Warehouse API Data

```javascript
const warehouseData = [
  { item_id: "NSJ001", name: "Sovereign Shearling Trench", category: "Jacket", price: 2850, stock: 40, status: "IN STOCK" },
  // (same data as in original code)
];
```

## Updated Usage Instructions

1. **Install Dependencies**
   - Ensure you have Node.js installed. Then create a new folder and navigate to it in your terminal. Run:
   ```bash
   npm init -y
   npm install express cors
   ```

2. **Set Up Environment Variables**
   - Set your `WEBHOOK_SECRET` in your environment to validate the webhook signature:
   ```bash
   export WEBHOOK_SECRET='your_shared_secret'
   ```

3. **Run the Server**
   - Create a file (e.g., `server.js`) and copy the server code into it. Then run:
   ```bash
   node server.js
   ```

4. **Access the API Endpoints**
   - You can test the API with any HTTP client (like Postman) or browser. Here are the endpoints to hit:
   - **Get stock data for a specific item**:
     - `GET http://localhost:5000/stock/:item_id`
     - Example: `http://localhost:5000/stock/NSD001`
     - **Expected Response**:
     ```json
     {
       "item_id": "NSD001",
       "name": "Opulent Backless Gown",
       "stock": 50,
       "status": "IN STOCK"
     }
     ```

   - **Get full cached inventory**:
     - `GET http://localhost:5000/stock/all`
     - **Expected Response**:
     ```json
     [
       {
         "item_id": "NSJ001",
         "name": "Sovereign Shearling Trench",
         "stock": 40,
         "status": "IN STOCK"
       },
       ...
     ]
     ```

   - **Send a test webhook payload** (using POST request):
     - `POST http://localhost:5000/webhook/inventory-update`
     - Payload example:
     ```json
     {
       "item_id": "NSD001",
       "name": "Opulent Backless Gown",
       "stock": 30,
       "status": "LOW STOCK",
       "timestamp": "2026-08-18T12:00:00Z",
       "signature": "your_signature_here" // Replace with calculated HMAC-SHA256 signature
     }
     ```
     
5. **View Webhook Event Log**
   - To see the last 10 webhook events:
     - `GET http://localhost:5000/webhook/log`
     - **Expected Response**:
     ```json
     [
       {
         "item_id": "NSD001",
         "stock": 30,
         "status": "LOW STOCK",
         "timestamp": "2026-08-18T12:00:00Z"
       },
       ...
     ]
     ```

This updated structure effectively replaces the polling system with a stable and clean webhook push model while maintaining the existing query endpoints and adding new functionalities.
