# Northstar Retail Co. — GraphQL Mini-Prototype (Days 1-2)

## 1. GraphQL Schema

```graphql
type Item {
  item_id: String!
  name: String!
  category: String!
  fabric: String!
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

## 2. Resolvers Implementation

```javascript
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
  { item_id: 'NSR002', name: 'Northstar Varsity Mesh Jersey', category: 'Jersey', fabric: 'Mesh', price: 350, stock: 10, status: 'LOW STOCK' },
  { item_id: 'NST001', name: 'Apex Leather Low-Top Trainers', category: 'Trainers', fabric: 'Leather', price: 680, stock: 50, status: 'IN STOCK' },
  { item_id: 'NST002', name: 'Runner High-Top Knit Trainer', category: 'Trainers', fabric: 'Knit', price: 750, stock: 30, status: 'IN STOCK' },
  { item_id: 'NSX001', name: 'Signature Ribbed Cashmere Socks', category: 'Socks', fabric: 'Cashmere', price: 120, stock: 80, status: 'IN STOCK' },
  { item_id: 'NSX002', name: 'Monogram Silk-Blend Dress Socks', category: 'Socks', fabric: 'Silk', price: 95, stock: 50, status: 'IN STOCK' },
  { item_id: 'NSM001', name: 'Crown Slouchy Cashmere Marvin', category: 'Marvin/Beanie', fabric: 'Cashmere', price: 240, stock: 70, status: 'IN STOCK' },
  { item_id: 'NSM002', name: 'Alpine Ribbed Wool-Cashmere Marvin', category: 'Marvin/Beanie', fabric: 'Wool', price: 190, stock: 50, status: 'IN STOCK' },
];

const resolvers = {
  Query: {
    getItem: (parent, { id }) => inventory.find(item => item.item_id === id),
    getAllItems: () => inventory,
    getByCategory: (parent, { category }) => inventory.filter(item => item.category === category),
    getOutOfStock: () => inventory.filter(item => item.status === 'OUT OF STOCK'),
    getLowStock: () => inventory.filter(item => item.status === 'LOW STOCK'),
  },
};
```

## 3. Complete Northstar Inventory Data Source

The inventory data is hardcoded in the above `inventory` array in the resolver implementation.

## 4. Sample Queries and Expected Responses

### Query 1: Get Item by ID

```graphql
query {
  getItem(id: "NSJ001") {
    item_id
    name
    category
    fabric
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
      "item_id": "NSJ001",
      "name": "Sovereign Shearling Trench",
      "category": "Jacket",
      "fabric": "Shearling",
      "price": 2850,
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
        "name": "Sovereign Shearling Trench"
      },
      {
        "item_id": "NSJ002",
        "name": "Imperial Velvet Evening Blazer"
      },
      // More items...
    ]
  }
}
```

### Query 3: Get Items by Category

```graphql
query {
  getByCategory(category: "Jacket") {
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
    "getByCategory": [
      {
        "item_id": "NSJ001",
        "name": "Sovereign Shearling Trench",
        "stock": 40
      },
      {
        "item_id": "NSJ002",
        "name": "Imperial Velvet Evening Blazer",
        "stock": 30
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

## 5. Setup/Run Instructions

1. **Install Dependencies**
   - Make sure you have Node.js installed.
   - Create a new directory for your project, navigate into it, and initialize with:
     ```bash
     npm init -y
     ```
   - Install Apollo Server and GraphQL:
     ```bash
     npm install apollo-server graphql
     ```

2. **Create `server.js`**
   - Create a new file named `server.js`.

3. **Copy the Code**
   - Copy the GraphQL schema and resolvers into `server.js` along with the necessary server setup:
   
```javascript
const { ApolloServer, gql } = require('apollo-server');

// GraphQL schema (replace with the schema provided above)
const typeDefs = gql`
  type Item {
    item_id: String!
    name: String!
    category: String!
    fabric: String!
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
`;

// Resolvers (replace with the resolvers provided above)
const inventory = [...]; // as above
const resolvers = { ... }; // as above

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

4. **Run the Server**
   - Execute the server by running:
     ```bash
     node server.js
     ```

5. **Test Queries**
   - Use a GraphQL client such as GraphiQL or Postman to test the sample queries mentioned.

This completes the mini-prototype for Northstar Retail Co.'s inventory system using GraphQL.