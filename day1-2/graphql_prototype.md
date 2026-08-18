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

## Resolver Implementation

```javascript
const { ApolloServer, gql } = require('apollo-server');

// Sample data source
const inventory = [
  { item_id: "NSJ001", name: "Sovereign Shearling Trench", category: "Jacket", fabric: null, price: 2850, stock: 40, status: "IN STOCK" },
  { item_id: "NSJ002", name: "Imperial Velvet Evening Blazer", category: "Jacket", fabric: null, price: 1950, stock: 30, status: "IN STOCK" },
  { item_id: "NSS001", name: "Monarch Chunky Cable Sweater", category: "Sweater", fabric: null, price: 1200, stock: 50, status: "IN STOCK" },
  { item_id: "NSS002", name: "Celestial Turtleneck Knit", category: "Sweater", fabric: null, price: 880, stock: 40, status: "IN STOCK" },
  { item_id: "NSC001", name: "Aura Lounge Hoodie & Pants Set", category: "Cashmere Set", fabric: null, price: 1650, stock: 60, status: "IN STOCK" },
  { item_id: "NSC002", name: "Ethereal Track Set in Rose Gold", category: "Cashmere Set", fabric: null, price: 1800, stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSD001", name: "Opulent Backless Gown", category: "Dress", fabric: null, price: 2200, stock: 50, status: "IN STOCK" },
  { item_id: "NSD002", name: "Seraphina Sequin Mini Dress", category: "Dress", fabric: null, price: 1450, stock: 30, status: "IN STOCK" },
  { item_id: "NSK001", name: "Aether Pleated Midi Skirt", category: "Skirt", fabric: null, price: 750, stock: 40, status: "IN STOCK" },
  { item_id: "NSK002", name: "Obsidian Leather Column Skirt", category: "Skirt", fabric: null, price: 1100, stock: 30, status: "IN STOCK" },
  { item_id: "NSB001", name: "Luminary Pussy-Bow Blouse", category: "Blouse", fabric: null, price: 620, stock: 50, status: "IN STOCK" },
  { item_id: "NSH001", name: "Atelier Tailored Crisp Shirt", category: "Shirt", fabric: null, price: 480, stock: 60, status: "IN STOCK" },
  { item_id: "NSW001", name: "Soleil Hand-Crochet Tunic", category: "Crochetwear", fabric: null, price: 890, stock: 20, status: "LOW STOCK" },
  { item_id: "NSW002", name: "Riviera Crochet Cardigan", category: "Crochetwear", fabric: null, price: 720, stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSJ003", name: "Vanguard Straight-Leg Denim", category: "Denim Jeans", fabric: null, price: 420, stock: 70, status: "IN STOCK" },
  { item_id: "NSJ004", name: "Noir Wide-Leg High-Rise Denim", category: "Denim Jeans", fabric: null, price: 450, stock: 50, status: "IN STOCK" },
  { item_id: "NSL001", name: "Velour Contour Leggings", category: "Leggings", fabric: null, price: 280, stock: 60, status: "IN STOCK" },
  { item_id: "NSR001", name: "Courtside Gold Edition Jersey", category: "Jersey", fabric: null, price: 390, stock: 40, status: "IN STOCK" },
  { item_id: "NSR002", name: "Northstar Varsity Mesh Jersey", category: "Jersey", fabric: null, price: 350, stock: 10, status: "LOW STOCK" },
  { item_id: "NST001", name: "Apex Leather Low-Top Trainers", category: "Trainers", fabric: null, price: 680, stock: 50, status: "IN STOCK" },
  { item_id: "NST002", name: "Runner High-Top Knit Trainer", category: "Trainers", fabric: null, price: 750, stock: 30, status: "IN STOCK" },
  { item_id: "NSX001", name: "Signature Ribbed Cashmere Socks", category: "Socks", fabric: null, price: 120, stock: 80, status: "IN STOCK" },
  { item_id: "NSX002", name: "Monogram Silk-Blend Dress Socks", category: "Socks", fabric: null, price: 95, stock: 50, status: "IN STOCK" },
  { item_id: "NSM001", name: "Crown Slouchy Cashmere Marvin", category: "Marvin/Beanie", fabric: null, price: 240, stock: 70, status: "IN STOCK" },
  { item_id: "NSM002", name: "Alpine Ribbed Wool-Cashmere Marvin", category: "Marvin/Beanie", fabric: null, price: 190, stock: 50, status: "IN STOCK" }
];

// GraphQL resolvers
const resolvers = {
  Query: {
    getItem: (parent, args) => {
      return inventory.find(item => item.item_id === args.id);
    },
    getAllItems: () => {
      return inventory;
    },
    getByCategory: (parent, args) => {
      return inventory.filter(item => item.category === args.category);
    },
    getOutOfStock: () => {
      return inventory.filter(item => item.status === "OUT OF STOCK");
    },
    getLowStock: () => {
      return inventory.filter(item => item.status === "LOW STOCK");
    }
  }
};

const server = new ApolloServer({
  typeDefs: gql`
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
  `,
  resolvers
});

// Server setup
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

## Complete Northstar Inventory Data Source

```javascript
const inventory = [
  // Complete inventory data as shown in the resolver implementation
];
```

## Sample Queries with Expected Responses

1. **Query for a specific item**
   ```graphql
   query {
     getItem(id: "NSD001") {
       item_id
       name
       category
       price
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
         "item_id": "NSD001",
         "name": "Opulent Backless Gown",
         "category": "Dress",
         "price": 2200,
         "stock": 50,
         "status": "IN STOCK"
       }
     }
   }
   ```

2. **Query for all items**
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
         { "item_id": "NSJ001", "name": "Sovereign Shearling Trench", "category": "Jacket" },
         { "item_id": "NSJ002", "name": "Imperial Velvet Evening Blazer", "category": "Jacket" },
         ...
       ]
     }
   }
   ```

3. **Query for items by category**
   ```graphql
   query {
     getByCategory(category: "Jacket") {
       item_id
       name
       price
     }
   }
   ```
   **Expected Response:**
   ```json
   {
     "data": {
       "getByCategory": [
         { "item_id": "NSJ001", "name": "Sovereign Shearling Trench", "price": 2850 },
         { "item_id": "NSJ002", "name": "Imperial Velvet Evening Blazer", "price": 1950 }
       ]
     }
   }
   ```

4. **Query for out of stock items**
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
         { "item_id": "NSC002", "name": "Ethereal Track Set in Rose Gold" },
         { "item_id": "NSW002", "name": "Riviera Crochet Cardigan" }
       ]
     }
   }
   ```

5. **Query for low stock items**
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
         { "item_id": "NSW001", "name": "Soleil Hand-Crochet Tunic", "stock": 20 },
         { "item_id": "NSR002", "name": "Northstar Varsity Mesh Jersey", "stock": 10 }
       ]
     }
   }
   ```

## Setup/Run Instructions

1. **Install Dependencies**
   ```bash
   npm install apollo-server graphql
   ```

2. **Run the Server**
   Create a file (e.g., `server.js`) and copy the resolver implementation and schema code into it. Then run:
   ```bash
   node server.js
   ```

3. **Access the GraphQL Playground**
   Open your browser and go to `http://localhost:4000` to access the GraphQL playground where you can write and test queries against the prototype.
