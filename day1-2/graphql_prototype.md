# Northstar Retail Co. — GraphQL Mini-Prototype (Days 1-2)

## GraphQL SDL Schema

```graphql
type Item {
  item_id: String!
  name: String!
  category: String!
  fabric: String
  price: Float!
  stock: Int!
  status: String!
}

type Query {
  getItem(id: String!): Item
  getAllItems: [Item]
  getByCategory(category: String!): [Item]
  getOutOfStock: [Item]
  getLowStock: [Item]
}
```

## Full Resolver Implementation

```javascript
const items = [
  { item_id: "NSJ001", name: "Sovereign Shearling Trench", category: "Jacket", fabric: "Shearling", price: 2850, stock: 40, status: "IN STOCK" },
  { item_id: "NSJ002", name: "Imperial Velvet Evening Blazer", category: "Jacket", fabric: "Velvet", price: 1950, stock: 30, status: "IN STOCK" },
  { item_id: "NSS001", name: "Monarch Chunky Cable Sweater", category: "Sweater", fabric: "Wool", price: 1200, stock: 50, status: "IN STOCK" },
  { item_id: "NSS002", name: "Celestial Turtleneck Knit", category: "Sweater", fabric: "Cotton", price: 880, stock: 40, status: "IN STOCK" },
  { item_id: "NSC001", name: "Aura Lounge Hoodie & Pants Set", category: "Cashmere Set", fabric: "Cashmere", price: 1650, stock: 60, status: "IN STOCK" },
  { item_id: "NSC002", name: "Ethereal Track Set in Rose Gold", category: "Cashmere Set", fabric: "Cashmere", price: 1800, stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSD001", name: "Opulent Backless Gown", category: "Dress", fabric: "Silk", price: 2200, stock: 50, status: "IN STOCK" },
  { item_id: "NSD002", name: "Seraphina Sequin Mini Dress", category: "Dress", fabric: "Sequin", price: 1450, stock: 30, status: "IN STOCK" },
  { item_id: "NSK001", name: "Aether Pleated Midi Skirt", category: "Skirt", fabric: "Cotton", price: 750, stock: 40, status: "IN STOCK" },
  { item_id: "NSK002", name: "Obsidian Leather Column Skirt", category: "Skirt", fabric: "Leather", price: 1100, stock: 30, status: "IN STOCK" },
  { item_id: "NSB001", name: "Luminary Pussy-Bow Blouse", category: "Blouse", fabric: "Polyester", price: 620, stock: 50, status: "IN STOCK" },
  { item_id: "NSH001", name: "Atelier Tailored Crisp Shirt", category: "Shirt", fabric: "Cotton", price: 480, stock: 60, status: "IN STOCK" },
  { item_id: "NSW001", name: "Soleil Hand-Crochet Tunic", category: "Crochetwear", fabric: "Cotton", price: 890, stock: 20, status: "LOW STOCK" },
  { item_id: "NSW002", name: "Riviera Crochet Cardigan", category: "Crochetwear", fabric: "Cotton", price: 720, stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSJ003", name: "Vanguard Straight-Leg Denim", category: "Denim Jeans", fabric: "Denim", price: 420, stock: 70, status: "IN STOCK" },
  { item_id: "NSJ004", name: "Noir Wide-Leg High-Rise Denim", category: "Denim Jeans", fabric: "Denim", price: 450, stock: 50, status: "IN STOCK" },
  { item_id: "NSL001", name: "Velour Contour Leggings", category: "Leggings", fabric: "Velour", price: 280, stock: 60, status: "IN STOCK" },
  { item_id: "NSR001", name: "Courtside Gold Edition Jersey", category: "Jersey", fabric: "Polyester", price: 390, stock: 40, status: "IN STOCK" },
  { item_id: "NSR002", name: "Northstar Varsity Mesh Jersey", category: "Jersey", fabric: "Mesh", price: 350, stock: 10, status: "LOW STOCK" },
  { item_id: "NST001", name: "Apex Leather Low-Top Trainers", category: "Trainers", fabric: "Leather", price: 680, stock: 50, status: "IN STOCK" },
  { item_id: "NST002", name: "Runner High-Top Knit Trainer", category: "Trainers", fabric: "Knit", price: 750, stock: 30, status: "IN STOCK" },
  { item_id: "NSX001", name: "Signature Ribbed Cashmere Socks", category: "Socks", fabric: "Cashmere", price: 120, stock: 80, status: "IN STOCK" },
  { item_id: "NSX002", name: "Monogram Silk-Blend Dress Socks", category: "Socks", fabric: "Silk", price: 95, stock: 50, status: "IN STOCK" },
  { item_id: "NSM001", name: "Crown Slouchy Cashmere Marvin", category: "Marvin/Beanie", fabric: "Cashmere", price: 240, stock: 70, status: "IN STOCK" },
  { item_id: "NSM002", name: "Alpine Ribbed Wool-Cashmere Marvin", category: "Marvin/Beanie", fabric: "Wool-Cashmere", price: 190, stock: 50, status: "IN STOCK" },
];

const resolvers = {
  Query: {
    getItem: (parent, { id }) => items.find(item => item.item_id === id),
    getAllItems: () => items,
    getByCategory: (parent, { category }) => items.filter(item => item.category === category),
    getOutOfStock: () => items.filter(item => item.stock === 0),
    getLowStock: () => items.filter(item => item.stock < 20), // Assuming low stock is defined as below 20
  },
};

module.exports = { items, resolvers };
```

## Sample Queries with Expected JSON Responses

### Query 1: Get Item by ID
```graphql
query {
  getItem(id: "NSJ001") {
    item_id
    name
    category
    stock
    status
  }
}
```
**Expected Response:**
```json
{
  "data": {
    "getItem": {
      "item_id": "NSJ001",
      "name": "Sovereign Shearling Trench",
      "category": "Jacket",
      "stock": 40,
      "status": "IN STOCK"
    }
  }
}
```
### Query 2: Get All Items
```graphql
query {
  getAllItems {
    item_id
    name
    category
  }
}
```
**Expected Response:**
```json
{
  "data": {
    "getAllItems": [
      {
        "item_id": "NSJ001",
        "name": "Sovereign Shearling Trench",
        "category": "Jacket"
      },
      {
        "item_id": "NSJ002",
        "name": "Imperial Velvet Evening Blazer",
        "category": "Jacket"
      },
      // ... other items
    ]
  }
}
```
### Query 3: Get Items by Category
```graphql
query {
  getByCategory(category: "Sweater") {
    item_id
    name
  }
}
```
**Expected Response:**
```json
{
  "data": {
    "getByCategory": [
      {
        "item_id": "NSS001",
        "name": "Monarch Chunky Cable Sweater"
      },
      {
        "item_id": "NSS002",
        "name": "Celestial Turtleneck Knit"
      }
    ]
  }
}
```
### Query 4: Get Out of Stock Items
```graphql
query {
  getOutOfStock {
    item_id
    name
  }
}
```
**Expected Response:**
```json
{
  "data": {
    "getOutOfStock": [
      {
        "item_id": "NSC002",
        "name": "Ethereal Track Set in Rose Gold"
      },
      {
        "item_id": "NSW002",
        "name": "Riviera Crochet Cardigan"
      }
    ]
  }
}
```
### Query 5: Get Low Stock Items
```graphql
query {
  getLowStock {
    item_id
    name
    stock
  }
}
```
**Expected Response:**
```json
{
  "data": {
    "getLowStock": [
      {
        "item_id": "NSW001",
        "name": "Soleil Hand-Crochet Tunic",
        "stock": 20
      },
      {
        "item_id": "NSR002",
        "name": "Northstar Varsity Mesh Jersey",
        "stock": 10
      }
    ]
  }
}
```
## Setup/Run Instructions
1. **Prerequisites:**
   - Ensure you have Node.js installed on your machine.
   - Create a new directory for your project.
2. **Initialize a Node.js Project:**
   ```bash
   mkdir northstar-graphql
   cd northstar-graphql
   npm init -y
   ```
3. **Install Apollo Server and GraphQL:**
   ```bash
   npm install apollo-server graphql
   ```
4. **Create an `index.js` File:**
   In the project root, create an `index.js` file, and paste the resolver implementation code provided above.
5. **Run the Server:**
   In the terminal, run:
   ```bash
   node index.js
   ```
6. **Access the GraphQL Playground:**
   Open your browser and go to `http://localhost:4000` to access the GraphQL playground where you can test the queries.

With these instructions, you can now run and test the Northstar Retail Co. GraphQL Mini-Prototype.
