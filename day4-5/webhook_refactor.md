# Northstar Retail Co. — Webhook Refactor (Days 4-5)

This document outlines the refactored implementation of the webhook push model for Northstar Retail Co. following the non-negotiable pivot on Day 4.

## Complete Code for Webhook Push Model

```javascript
// Import necessary modules
const express = require('express'); // Express framework for building APIs
const cors = require('cors'); // CORS middleware for enabling cross-origin requests
const crypto = require('crypto'); // Crypto module for HMAC-SHA256 signature validation

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON body

// Mock warehouse data representing the full Northstar inventory
const warehouseData = [
  // ... (same as before, omitted for brevity)
];

// In-memory cache object for storing stock levels keyed by item_id
const stockCache = {};

// Function to update stock cache with warehouse data
const updateCache = (item) => {
  stockCache[item.item_id] = {
    name: item.name,
    stock: item.stock,
    status: item.status
  };
};

// Webhook event log
const webhookEventLog = [];

// New endpoint for receiving webhook updates [DAY 4 PIVOT - Added]
app.post('/webhook/inventory-update', (req, res) => {
  const { item_id, name, stock, status, timestamp, signature } = req.body;

  // Signature validation
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  const hash = crypto.createHmac('sha256', WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== signature) { // If the signature is invalid
    return res.status(401).send('Unauthorized'); // [DAY 4 PIVOT - Added]
  }

  // Valid webhook
  const item = { item_id, name, stock, status, timestamp };
  updateCache(item); // Update the in-memory cache
  webhookEventLog.push(item); // Save to event log
  if (webhookEventLog.length > 10) {
    webhookEventLog.shift(); // Keep only the last 10 events
  }
  
  res.status(200).send('Inventory updated'); // Respond to webhook
});

// REST endpoint to get stock for a specific item by item_id [DAY 4 PIVOT - Added]
app.get('/stock/:item_id', (req, res) => {
  const itemId = req.params.item_id;
  const stockData = stockCache[itemId];
  
  // Return stock data if found, otherwise return a 404 error
  if (stockData) {
    res.json(stockData);
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

// REST endpoint to get all stock data in cache [DAY 4 PIVOT - Added]
app.get('/stock/all', (req, res) => {
  res.json(stockCache);
});

// Webhook event log endpoint [DAY 4 PIVOT - Added]
app.get('/webhook/log', (req, res) => {
  res.json(webhookEventLog);
});

// DEPRECATED - Removed per Day 4 Pivot
// Function to update stock cache every 5 minutes
// const updateCache = () => {
//   // Update cache with mock warehouse data
//   warehouseData.forEach(item => {
//     stockCache[item.item_id] = {
//       name: item.name,
//       stock: item.stock,
//       status: item.status
//     };
//   });
// };

// DEPRECATED - Removed per Day 4 Pivot
// // Set an interval to poll the warehouse every 5 minutes (300000 milliseconds)
// setInterval(() => {
//   console.log("Polling warehouse API and updating stock cache...");
//   updateCache();
// }, 300000); // Poll every 5 minutes

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

## Updated Usage Instructions

1. **Prerequisites:**
   - Ensure you have Node.js installed on your machine.
   - Set the `WEBHOOK_SECRET` environment variable.

2. **Setup Project:**
   Create a new directory and navigate into it:
   ```bash
   mkdir northstar-webhook-service
   cd northstar-webhook-service
   ```

3. **Initialize Node.js Project:**
   ```bash
   npm init -y
   ```

4. **Install Dependencies:**
   ```bash
   npm install express cors
   ```

5. **Create and Edit the Server File:**
   Create a file named `server.js` and paste the complete code provided above.

6. **Run the Server:**
   Execute the following command:
   ```bash
   node server.js
   ```

7. **Access the API Endpoints:**
   - **Get Stock by Item ID:**
     ```
     GET http://localhost:3000/stock/{item_id}
     ```
     Replace `{item_id}` with the actual item's id (e.g., `NSJ001`).

   - **Get All Stock:**
     ```
     GET http://localhost:3000/stock/all
     ```

   - **Send Webhook Payloads for Testing:**
     To test the webhook, send a POST request to:
     ```
     POST http://localhost:3000/webhook/inventory-update
     ```
     With a JSON body, example:
     ```json
     {
       "item_id": "NSJ001",
       "name": "Sovereign Shearling Trench",
       "stock": 35,
       "status": "LOW STOCK",
       "timestamp": "2026-08-19T10:00:00Z",
       "signature": "YOUR_SIGNED_HASH"
     }
     ```
     Make sure to replace `YOUR_SIGNED_HASH` with the HMAC-SHA256 signature computed using the payload and the `WEBHOOK_SECRET`.

   - **Get Webhook Event Log:**
     ```
     GET http://localhost:3000/webhook/log
     ```

8. **Expected Response:**
   - For a specific item:
     ```json
     {
       "item_id": "NSJ001",
       "name": "Sovereign Shearling Trench",
       "stock": 35,
       "status": "LOW STOCK"
     }
     ```
   - For all stock:
     ```json
     {
       "NSJ001": { "name": "Sovereign Shearling Trench", "stock": 35, "status": "LOW STOCK" },
       ...
     }
     ```
   - For webhook log:
     ```json
     [
       {
         "item_id": "NSJ001",
         "name": "Sovereign Shearling Trench",
         "stock": 35,
         "status": "LOW STOCK",
         "timestamp": "2026-08-19T10:00:00Z"
       }
     ]
     ```

This concludes the implementation setup for the Day 4 pivot to a webhook push model for Northstar Retail Co.
