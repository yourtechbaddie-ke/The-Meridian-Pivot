# Northstar Retail Co. — Original Polling System (Day 3)

This document outlines the implementation of the original polling service for Northstar Retail Co. This baseline codebase will later pivot into different functionality on Day 4.

## Complete Code for Polling System

```javascript
// Import necessary modules
const express = require('express'); // Express framework for building APIs
const cors = require('cors'); // CORS middleware for enabling cross-origin requests

// Initialize express app
const app = express();
app.use(cors());

// Mock warehouse data representing the full Northstar inventory
const warehouseData = [
  { item_id: "NSJ001", name: "Sovereign Shearling Trench", category: "Jacket", stock: 40, status: "IN STOCK" },
  { item_id: "NSJ002", name: "Imperial Velvet Evening Blazer", category: "Jacket", stock: 30, status: "IN STOCK" },
  { item_id: "NSS001", name: "Monarch Chunky Cable Sweater", category: "Sweater", stock: 50, status: "IN STOCK" },
  { item_id: "NSS002", name: "Celestial Turtleneck Knit", category: "Sweater", stock: 40, status: "IN STOCK" },
  { item_id: "NSC001", name: "Aura Lounge Hoodie & Pants Set", category: "Cashmere Set", stock: 60, status: "IN STOCK" },
  { item_id: "NSC002", name: "Ethereal Track Set in Rose Gold", category: "Cashmere Set", stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSD001", name: "Opulent Backless Gown", category: "Dress", stock: 50, status: "IN STOCK" },
  { item_id: "NSD002", name: "Seraphina Sequin Mini Dress", category: "Dress", stock: 30, status: "IN STOCK" },
  { item_id: "NSK001", name: "Aether Pleated Midi Skirt", category: "Skirt", stock: 40, status: "IN STOCK" },
  { item_id: "NSK002", name: "Obsidian Leather Column Skirt", category: "Skirt", stock: 30, status: "IN STOCK" },
  { item_id: "NSB001", name: "Luminary Pussy-Bow Blouse", category: "Blouse", stock: 50, status: "IN STOCK" },
  { item_id: "NSH001", name: "Atelier Tailored Crisp Shirt", category: "Shirt", stock: 60, status: "IN STOCK" },
  { item_id: "NSW001", name: "Soleil Hand-Crochet Tunic", category: "Crochetwear", stock: 20, status: "LOW STOCK" },
  { item_id: "NSW002", name: "Riviera Crochet Cardigan", category: "Crochetwear", stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSJ003", name: "Vanguard Straight-Leg Denim", category: "Denim Jeans", stock: 70, status: "IN STOCK" },
  { item_id: "NSJ004", name: "Noir Wide-Leg High-Rise Denim", category: "Denim Jeans", stock: 50, status: "IN STOCK" },
  { item_id: "NSL001", name: "Velour Contour Leggings", category: "Leggings", stock: 60, status: "IN STOCK" },
  { item_id: "NSR001", name: "Courtside Gold Edition Jersey", category: "Jersey", stock: 40, status: "IN STOCK" },
  { item_id: "NSR002", name: "Northstar Varsity Mesh Jersey", category: "Jersey", stock: 10, status: "LOW STOCK" },
  { item_id: "NST001", name: "Apex Leather Low-Top Trainers", category: "Trainers", stock: 50, status: "IN STOCK" },
  { item_id: "NST002", name: "Runner High-Top Knit Trainer", category: "Trainers", stock: 30, status: "IN STOCK" },
  { item_id: "NSX001", name: "Signature Ribbed Cashmere Socks", category: "Socks", stock: 80, status: "IN STOCK" },
  { item_id: "NSX002", name: "Monogram Silk-Blend Dress Socks", category: "Socks", stock: 50, status: "IN STOCK" },
  { item_id: "NSM001", name: "Crown Slouchy Cashmere Marvin", category: "Marvin/Beanie", stock: 70, status: "IN STOCK" },
  { item_id: "NSM002", name: "Alpine Ribbed Wool-Cashmere Marvin", category: "Marvin/Beanie", stock: 50, status: "IN STOCK" },
];

// In-memory cache object for storing stock levels keyed by item_id
const stockCache = {};

// Function to update stock cache every 5 minutes
const updateCache = () => {
  // Update cache with mock warehouse data
  warehouseData.forEach(item => {
    stockCache[item.item_id] = {
      name: item.name,
      stock: item.stock,
      status: item.status
    };
  });
};

// Initial cache update
updateCache();

// Set an interval to poll the warehouse every 5 minutes (300000 milliseconds)
// This will be deprecated on Day 4, identified by the comment
setInterval(() => {
  console.log("Polling warehouse API and updating stock cache...");
  updateCache();
}, 300000); // Poll every 5 minutes

// REST endpoint to get stock for a specific item by item_id
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

// REST endpoint to get all stock data in cache
app.get('/stock/all', (req, res) => {
  res.json(stockCache);
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

## Mock Warehouse API Data

```json
[
  { "item_id": "NSJ001", "name": "Sovereign Shearling Trench", "category": "Jacket", "stock": 40, "status": "IN STOCK" },
  { "item_id": "NSJ002", "name": "Imperial Velvet Evening Blazer", "category": "Jacket", "stock": 30, "status": "IN STOCK" },
  { "item_id": "NSS001", "name": "Monarch Chunky Cable Sweater", "category": "Sweater", "stock": 50, "status": "IN STOCK" },
  { "item_id": "NSS002", "name": "Celestial Turtleneck Knit", "category": "Sweater", "stock": 40, "status": "IN STOCK" },
  { "item_id": "NSC001", "name": "Aura Lounge Hoodie & Pants Set", "category": "Cashmere Set", "stock": 60, "status": "IN STOCK" },
  { "item_id": "NSC002", "name": "Ethereal Track Set in Rose Gold", "category": "Cashmere Set", "stock": 0, "status": "OUT OF STOCK" },
  { "item_id": "NSD001", "name": "Opulent Backless Gown", "category": "Dress", "stock": 50, "status": "IN STOCK" },
  { "item_id": "NSD002", "name": "Seraphina Sequin Mini Dress", "category": "Dress", "stock": 30, "status": "IN STOCK" },
  { "item_id": "NSK001", "name": "Aether Pleated Midi Skirt", "category": "Skirt", "stock": 40, "status": "IN STOCK" },
  { "item_id": "NSK002", "name": "Obsidian Leather Column Skirt", "category": "Skirt", "stock": 30, "status": "IN STOCK" },
  { "item_id": "NSB001", "name": "Luminary Pussy-Bow Blouse", "category": "Blouse", "stock": 50, "status": "IN STOCK" },
  { "item_id": "NSH001", "name": "Atelier Tailored Crisp Shirt", "category": "Shirt", "stock": 60, "status": "IN STOCK" },
  { "item_id": "NSW001", "name": "Soleil Hand-Crochet Tunic", "category": "Crochetwear", "stock": 20, "status": "LOW STOCK" },
  { "item_id": "NSW002", "name": "Riviera Crochet Cardigan", "category": "Crochetwear", "stock": 0, "status": "OUT OF STOCK" },
  { "item_id": "NSJ003", "name": "Vanguard Straight-Leg Denim", "category": "Denim Jeans", "stock": 70, "status": "IN STOCK" },
  { "item_id": "NSJ004", "name": "Noir Wide-Leg High-Rise Denim", "category": "Denim Jeans", "stock": 50, "status": "IN STOCK" },
  { "item_id": "NSL001", "name": "Velour Contour Leggings", "category": "Leggings", "stock": 60, "status": "IN STOCK" },
  { "item_id": "NSR001", "name": "Courtside Gold Edition Jersey", "category": "Jersey", "stock": 40, "status": "IN STOCK" },
  { "item_id": "NSR002", "name": "Northstar Varsity Mesh Jersey", "category": "Jersey", "stock": 10, "status": "LOW STOCK" },
  { "item_id": "NST001", "name": "Apex Leather Low-Top Trainers", "category": "Trainers", "stock": 50, "status": "IN STOCK" },
  { "item_id": "NST002", "name": "Runner High-Top Knit Trainer", "category": "Trainers", "stock": 30, "status": "IN STOCK" },
  { "item_id": "NSX001", "name": "Signature Ribbed Cashmere Socks", "category": "Socks", "stock": 80, "status": "IN STOCK" },
  { "item_id": "NSX002", "name": "Monogram Silk-Blend Dress Socks", "category": "Socks", "stock": 50, "status": "IN STOCK" },
  { "item_id": "NSM001", "name": "Crown Slouchy Cashmere Marvin", "category": "Marvin/Beanie", "stock": 70, "status": "IN STOCK" },
  { "item_id": "NSM002", "name": "Alpine Ribbed Wool-Cashmere Marvin", "category": "Marvin/Beanie", "stock": 50, "status": "IN STOCK" }
]
```
## Usage Instructions
1. **Prerequisites:**
   - Ensure you have Node.js installed on your machine.
2. **Setup Project:**
   Create a new directory and navigate into it:
   ```bash
   mkdir northstar-polling-service
   cd northstar-polling-service
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

8. **Expected Response:**
   - For a specific item:
     ```json
     {
       "item_id": "NSJ001",
       "name": "Sovereign Shearling Trench",
       "stock": 40,
       "status": "IN STOCK"
     }
     ```
   - For all stock:
     ```json
     {
       "NSJ001": { "name": "Sovereign Shearling Trench", "stock": 40, "status": "IN STOCK" },
       ...
     }
     ```
This concludes the implementation setup for the Day 3 polling system for Northstar Retail Co.
