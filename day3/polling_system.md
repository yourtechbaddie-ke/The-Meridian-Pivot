# Northstar Retail Co. — Original Polling System (Day 3)

## Full Server/App Code

```javascript
// Importing necessary modules
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Create an Express application
const app = express();
app.use(cors()); // Enable CORS for all routes

// In-memory cache to store stock data
const stockCache = {};

// Mock warehouse API data (Northstar inventory)
const warehouseData = [
  { item_id: "NSJ001", name: "Sovereign Shearling Trench", category: "Jacket", price: 2850, stock: 40, status: "IN STOCK" },
  { item_id: "NSJ002", name: "Imperial Velvet Evening Blazer", category: "Jacket", price: 1950, stock: 30, status: "IN STOCK" },
  { item_id: "NSS001", name: "Monarch Chunky Cable Sweater", category: "Sweater", price: 1200, stock: 50, status: "IN STOCK" },
  { item_id: "NSS002", name: "Celestial Turtleneck Knit", category: "Sweater", price: 880, stock: 40, status: "IN STOCK" },
  { item_id: "NSC001", name: "Aura Lounge Hoodie & Pants Set", category: "Cashmere Set", price: 1650, stock: 60, status: "IN STOCK" },
  { item_id: "NSC002", name: "Ethereal Track Set in Rose Gold", category: "Cashmere Set", price: 1800, stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSD001", name: "Opulent Backless Gown", category: "Dress", price: 2200, stock: 50, status: "IN STOCK" },
  { item_id: "NSD002", name: "Seraphina Sequin Mini Dress", category: "Dress", price: 1450, stock: 30, status: "IN STOCK" },
  { item_id: "NSK001", name: "Aether Pleated Midi Skirt", category: "Skirt", price: 750, stock: 40, status: "IN STOCK" },
  { item_id: "NSK002", name: "Obsidian Leather Column Skirt", category: "Skirt", price: 1100, stock: 30, status: "IN STOCK" },
  { item_id: "NSB001", name: "Luminary Pussy-Bow Blouse", category: "Blouse", price: 620, stock: 50, status: "IN STOCK" },
  { item_id: "NSH001", name: "Atelier Tailored Crisp Shirt", category: "Shirt", price: 480, stock: 60, status: "IN STOCK" },
  { item_id: "NSW001", name: "Soleil Hand-Crochet Tunic", category: "Crochetwear", price: 890, stock: 20, status: "LOW STOCK" },
  { item_id: "NSW002", name: "Riviera Crochet Cardigan", category: "Crochetwear", price: 720, stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSJ003", name: "Vanguard Straight-Leg Denim", category: "Denim Jeans", price: 420, stock: 70, status: "IN STOCK" },
  { item_id: "NSJ004", name: "Noir Wide-Leg High-Rise Denim", category: "Denim Jeans", price: 450, stock: 50, status: "IN STOCK" },
  { item_id: "NSL001", name: "Velour Contour Leggings", category: "Leggings", price: 280, stock: 60, status: "IN STOCK" },
  { item_id: "NSR001", name: "Courtside Gold Edition Jersey", category: "Jersey", price: 390, stock: 40, status: "IN STOCK" },
  { item_id: "NSR002", name: "Northstar Varsity Mesh Jersey", category: "Jersey", price: 350, stock: 10, status: "LOW STOCK" },
  { item_id: "NST001", name: "Apex Leather Low-Top Trainers", category: "Trainers", price: 680, stock: 50, status: "IN STOCK" },
  { item_id: "NST002", name: "Runner High-Top Knit Trainer", category: "Trainers", price: 750, stock: 30, status: "IN STOCK" },
  { item_id: "NSX001", name: "Signature Ribbed Cashmere Socks", category: "Socks", price: 120, stock: 80, status: "IN STOCK" },
  { item_id: "NSX002", name: "Monogram Silk-Blend Dress Socks", category: "Socks", price: 95, stock: 50, status: "IN STOCK" },
  { item_id: "NSM001", name: "Crown Slouchy Cashmere Marvin", category: "Marvin/Beanie", price: 240, stock: 70, status: "IN STOCK" },
  { item_id: "NSM002", name: "Alpine Ribbed Wool-Cashmere Marvin", category: "Marvin/Beanie", price: 190, stock: 50, status: "IN STOCK" }
];

// Function to poll the warehouse API (mocked data source here)
const pollWarehouseAPI = () => {
  console.log("Polling warehouse API for stock updates...");

  // Refreshing the cache with the mock warehouse data
  warehouseData.forEach(item => {
    stockCache[item.item_id] = {
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      status: item.stock > 0 ? (item.stock < 20 ? "LOW STOCK" : "IN STOCK") : "OUT OF STOCK"
    };
  });

  console.log("Warehouse stock cache updated.");
};

// Polling every 5 minutes (300,000 milliseconds)
const pollingInterval = setInterval(pollWarehouseAPI, 300000);
// Initial call to populate the cache immediately upon startup
pollWarehouseAPI();

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
  { item_id: "NSJ002", name: "Imperial Velvet Evening Blazer", category: "Jacket", price: 1950, stock: 30, status: "IN STOCK" },
  { item_id: "NSS001", name: "Monarch Chunky Cable Sweater", category: "Sweater", price: 1200, stock: 50, status: "IN STOCK" },
  { item_id: "NSS002", name: "Celestial Turtleneck Knit", category: "Sweater", price: 880, stock: 40, status: "IN STOCK" },
  { item_id: "NSC001", name: "Aura Lounge Hoodie & Pants Set", category: "Cashmere Set", price: 1650, stock: 60, status: "IN STOCK" },
  { item_id: "NSC002", name: "Ethereal Track Set in Rose Gold", category: "Cashmere Set", price: 1800, stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSD001", name: "Opulent Backless Gown", category: "Dress", price: 2200, stock: 50, status: "IN STOCK" },
  { item_id: "NSD002", name: "Seraphina Sequin Mini Dress", category: "Dress", price: 1450, stock: 30, status: "IN STOCK" },
  { item_id: "NSK001", name: "Aether Pleated Midi Skirt", category: "Skirt", price: 750, stock: 40, status: "IN STOCK" },
  { item_id: "NSK002", name: "Obsidian Leather Column Skirt", category: "Skirt", price: 1100, stock: 30, status: "IN STOCK" },
  { item_id: "NSB001", name: "Luminary Pussy-Bow Blouse", category: "Blouse", price: 620, stock: 50, status: "IN STOCK" },
  { item_id: "NSH001", name: "Atelier Tailored Crisp Shirt", category: "Shirt", price: 480, stock: 60, status: "IN STOCK" },
  { item_id: "NSW001", name: "Soleil Hand-Crochet Tunic", category: "Crochetwear", price: 890, stock: 20, status: "LOW STOCK" },
  { item_id: "NSW002", name: "Riviera Crochet Cardigan", category: "Crochetwear", price: 720, stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSJ003", name: "Vanguard Straight-Leg Denim", category: "Denim Jeans", price: 420, stock: 70, status: "IN STOCK" },
  { item_id: "NSJ004", name: "Noir Wide-Leg High-Rise Denim", category: "Denim Jeans", price: 450, stock: 50, status: "IN STOCK" },
  { item_id: "NSL001", name: "Velour Contour Leggings", category: "Leggings", price: 280, stock: 60, status: "IN STOCK" },
  { item_id: "NSR001", name: "Courtside Gold Edition Jersey", category: "Jersey", price: 390, stock: 40, status: "IN STOCK" },
  { item_id: "NSR002", name: "Northstar Varsity Mesh Jersey", category: "Jersey", price: 350, stock: 10, status: "LOW STOCK" },
  { item_id: "NST001", name: "Apex Leather Low-Top Trainers", category: "Trainers", price: 680, stock: 50, status: "IN STOCK" },
  { item_id: "NST002", name: "Runner High-Top Knit Trainer", category: "Trainers", price: 750, stock: 30, status: "IN STOCK" },
  { item_id: "NSX001", name: "Signature Ribbed Cashmere Socks", category: "Socks", price: 120, stock: 80, status: "IN STOCK" },
  { item_id: "NSX002", name: "Monogram Silk-Blend Dress Socks", category: "Socks", price: 95, stock: 50, status: "IN STOCK" },
  { item_id: "NSM001", name: "Crown Slouchy Cashmere Marvin", category: "Marvin/Beanie", price: 240, stock: 70, status: "IN STOCK" },
  { item_id: "NSM002", name: "Alpine Ribbed Wool-Cashmere Marvin", category: "Marvin/Beanie", price: 190, stock: 50, status: "IN STOCK" }
];
```

## Clear Comments on Polling-Related Functions

```javascript
// Function to poll the warehouse API (mock data source here)
const pollWarehouseAPI = () => {
  console.log("Polling warehouse API for stock updates...");

  // Refreshing the cache with the mock warehouse data
  warehouseData.forEach(item => {
    stockCache[item.item_id] = {
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      status: item.stock > 0 ? (item.stock < 20 ? "LOW STOCK" : "IN STOCK") : "OUT OF STOCK"
    };
  });

  console.log("Warehouse stock cache updated.");
};

// Polling every 5 minutes (300,000 milliseconds)
const pollingInterval = setInterval(pollWarehouseAPI, 300000);
// Initial call to populate the cache immediately upon startup
pollWarehouseAPI();
```

## Usage Instructions

1. **Install Dependencies**
   - Ensure you have Node.js installed. Then create a new folder and navigate to it in your terminal. Run:
   ```bash
   npm init -y
   npm install express cors axios
   ```

2. **Run the Server**
   - Create a file (e.g., `server.js`) and copy the server code into it. Then run:
   ```bash
   node server.js
   ```

3. **Access the API Endpoints**
   - You can test the API with any HTTP client (like Postman) or browser. Here are the endpoints to hit:
   - **Get stock data for a specific item**:
     - `GET http://localhost:5000/stock/:item_id`
     - Example: `http://localhost:5000/stock/NSD001`
     - **Expected Response**:
     ```json
     {
       "item_id": "NSD001",
       "name": "Opulent Backless Gown",
       "category": "Dress",
       "price": 2200,
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
         "category": "Jacket",
         "price": 2850,
         "stock": 40,
         "status": "IN STOCK"
       },
       ...
     ]
     ```

Please refer to this setup and usage as a comprehensive guide to running and interacting with the Northstar Retail Co. polling system.
