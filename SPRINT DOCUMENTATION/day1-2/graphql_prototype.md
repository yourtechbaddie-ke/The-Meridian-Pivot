# Northstar Retail Co. — GraphQL Mini-Prototype (Days 1-2)

## 1. Full GraphQL SDL Schema

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

## 2. Full Resolver Implementation

```javascript
const { ApolloServer, gql } = require('apollo-server');

// Northstar inventory data source
const inventory = [
  { item_id: "NSJ001", name: "Sovereign Shearling Trench", category: "Jacket", fabric: "Shearling", price: 2850, stock: 40, status: "IN STOCK" },
  { item_id: "NSJ002", name: "Imperial Velvet Evening Blazer", category: "Jacket", fabric: "Velvet", price: 1950, stock: 30, status: "IN STOCK" },
  { item_id: "NSS001", name: "Monarch Chunky Cable Sweater", category: "Sweater", fabric: "Wool", price: 1200, stock: 50, status: "IN STOCK" },
  { item_id: "NSS002", name: "Celestial Turtleneck Knit", category: "Sweater", fabric: "Knit", price: 880, stock: 40, status: "IN STOCK" },
  { item_id: "NSC001", name: "Aura Lounge Hoodie & Pants Set", category: "Cashmere Set", fabric: "Cashmere", price: 1650, stock: 60, status: "IN STOCK" },
  { item_id: "NSC002", name: "Ethereal Track Set in Rose Gold", category: "Cashmere Set", fabric: "Cashmere", price: 1800, stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSD001", name: "Opulent Backless Gown", category: "Dress", fabric: "Silk", price: 2200, stock: 50, status: "IN STOCK" },
  { item_id: "NSD002", name: "Seraphina Sequin Mini Dress", category: "Dress", fabric: "Satin", price: 1450, stock: 30, status: "IN STOCK" },
  { item_id: "NSK001", name: "Aether Pleated Midi Skirt", category: "Skirt", fabric: "Silk", price: 750, stock: 40, status: "IN STOCK" },
  { item_id: "NSK002", name: "Obsidian Leather Column Skirt", category: "Skirt", fabric: "Leather", price: 1100, stock: 30, status: "IN STOCK" },
  { item_id: "NSB001", name: "Luminary Pussy-Bow Blouse", category: "Blouse", fabric: "Satin", price: 620, stock: 50, status: "IN STOCK" },
  { item_id: "NSH001", name: "Atelier Tailored Crisp Shirt", category: "Shirt", fabric: "Cotton", price: 480, stock: 60, status: "IN STOCK" },
  { item_id: "NSW001", name: "Soleil Hand-Crochet Tunic", category: "Crochetwear", fabric: "Cotton", price: 890, stock: 20, status: "LOW STOCK" },
  { item_id: "NSW002", name: "Riviera Crochet Cardigan", category: "Crochetwear", fabric: "Cotton", price: 720, stock: 0, status: "OUT OF STOCK" },
  { item_id: "NSJ003", name: "Vanguard Straight-Leg Denim", category: "Denim Jeans", fabric: "Denim", price: 420, stock: 70, status: "IN STOCK" },
  { item_id: "NSJ004", name: "Noir Wide-Leg High-Rise Denim", category: "Denim Jeans", fabric: "Denim", price: 450, stock: 50, status: "IN STOCK" },
  { item_id: "NSL001", name: "Velour Contour Leggings", category: "Leggings", fabric: "Velour", price: 280, stock: 60, status: "IN STOCK" },
  { item_id: "NSR001", name: "Courtside Gold Edition Jersey", category: "Jersey", fabric: "Mesh", price: 390, stock: 40, status: "IN STOCK" },
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
    getItem: (parent, { id }) => inventory.find(item => item.item_id === id),
    getAllItems: () => inventory,
    getByCategory: (parent, { category }) => inventory.filter(item => item.category === category),
    getOutOfStock: () => inventory.filter(item => item.status === "OUT OF STOCK"),
    getLowStock: () => inventory.filter(item => item.status === "LOW STOCK"),
  },
};

const server = new ApolloServer({
  typeDefs: gql`
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
  `,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

## 3. The Complete Northstar Inventory Data Source

The complete inventory data has been included in the resolver implementation above as a JavaScript array.

## 4. Sample Query Examples with Expected JSON Responses

### a. Get a Single Item by ID

**Query:**
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

### b. Get All Items

**Query:**
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
      { "item_id": "NSJ001", "name": "Sovereign Shearling Trench" },
      { "item_id": "NSJ002", "name": "Imperial Velvet Evening Blazer" },
      // other items...
    ]
  }
}
```

### c. Get Items by Category

**Query:**
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
      { "item_id": "NSS001", "name": "Monarch Chunky Cable Sweater" },
      { "item_id": "NSS002", "name": "Celestial Turtleneck Knit" }
    ]
  }
}
```

### d. Get Out of Stock Items

**Query:**
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

### e. Get Low Stock Items

**Query:**
```graphql
query {
  getLowStock {
    item_id
    name
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "getLowStock": [
      { "item_id": "NSW001", "name": "Soleil Hand-Crochet Tunic" },
      { "item_id": "NSR002", "name": "Northstar Varsity Mesh Jersey" }
    ]
  }
}
```

## 5. Setup/Run Instructions

1. **Install Node.js**: Ensure you have Node.js installed on your machine (https://nodejs.org/).

2. **Create Project Directory**:
   ```bash
   mkdir northstar-graphql-prototype
   cd northstar-graphql-prototype
   ```

3. **Initialize a New Project**:
   ```bash
   npm init -y
   ```

4. **Install Apollo Server and GraphQL**:
   ```bash
   npm install apollo-server graphql
   ```

5. **Create Server File**:
   Create a file named `server.js` and paste the resolver implementation provided above.

6. **Run the Server**:
   ```bash
   node server.js
   ```

7. **Visit the GraphQL Playground**:
   Open your browser and go to `http://localhost:4000` to access the GraphQL playground to run the sample queries.


---
# Learning & Blocker Journal — Days 1-2 (GraphQL Solo Recon)

## Day 1 — August 19, 2026

### Time Log: Total ~8 hours

- **09:00 - 10:00**: Research and Initial Setup
- **10:00 - 12:00**: Understanding GraphQL Basics
- **12:00 - 01:00**: Lunch Break
- **01:00 - 03:00**: Implementing Sample Queries 
- **03:00 - 04:00**: Blocker 1: Syntax Errors in Queries
- **04:00 - 06:00**: Troubleshooting and Breakthroughs
- **06:00 - 07:00**: Dead End: Learning Resources

### Resources Consulted
1. [GraphQL Official Documentation](https://graphql.org/learn/)
2. [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
3. [How to GraphQL Tutorial](https://www.howtographql.com/basics/0-introduction/)

### Key Activities & Learnings
- **Setup**: Installed Node.js and created a new project following the provided instructions. This process took approximately an hour.
- **Understanding GraphQL**: Read through the basics of GraphQL, focusing on its structure, concepts of queries, mutations, and schemas. This was somewhat confusing at first as I struggled to wrap my head around the declarative nature of queries.

### Blocker 1: Syntax Errors in Queries
- **What Happened**: When attempting to create a simple query for fetching items using the GraphQL Playground, I kept receiving syntax errors regarding the structure of my queries. 
- **Error Message Encountered**: `Syntax Error: Expected Name, found <EOF>.`
  
### Resolution Steps
1. Revisited the GraphQL documentation to clarify the syntax for defining queries.
2. Searched for common beginner mistakes online and found that the error often meant that my query format didn’t match the schema.
3. Took a deep dive into the sample queries section in the documentation, which helped me format my queries correctly.
   
**Breakthrough**: Successfully created my first query to get a single item by ID (e.g., `getItem(id: "NSJ001")`). This moment helped solidify my understanding of how to structure queries. 

### Blocker 2: Confusion Around Data Responses
- **What Happened**: After sending queries, I struggled to interpret the structure of JSON responses received.
  
### Resolution Steps
1. I examined the example responses provided in the tutorial resources, aligning them with the structure of my queries.
2. Tailored queries to request simple fields initially to better visualize outputs.
3. Confirmed the names in the response matched the GraphQL schema.

### Dead End: Learning Resources
- **What Happened**: I hit a dead end while trying to find comprehensive examples specifically tailored for inventory management in GraphQL.
  
### Resolution Steps
1. Shifted my search parameters to focus on "GraphQL inventory management examples” and discovered a series of blog posts and tutorial videos outlining best practices for designing schemas.
2. I bookmarked several resources for further review and clarity.

---

## Day 2 — August 20, 2026

### Time Log: Total ~7 hours

- **09:00 - 10:00**: Review of Previous Day's Learnings
- **10:00 - 12:00**: Building the Mini-Prototype
- **12:00 - 01:00**: Lunch Break
- **01:00 - 03:00**: Blocker 3: Issues with Apollo Server Initialization
- **03:00 - 04:30**: Implementing Additional Queries
- **04:30 - 05:30**: Final Testing
- **05:30 - 06:00**: Documentation of the Prototype

### Resources Consulted
1. [Apollo Server Initialization Guide](https://www.apollographql.com/docs/apollo-server/getting-started/quick-start/)
2. [GraphQL Essentials](https://www.packtpub.com/product/graphql-essentials/9781838824251)

### Key Activities & Learnings
- **Building the Prototype**: Successfully integrated the Apollo server setup with Node.js as per the provided implementation.
- **New Queries**: Created queries for `getAllItems`, `getByCategory`, `getOutOfStock`, and `getLowStock`.

### Blocker 3: Issues with Apollo Server Initialization
- **What Happened**: Encountered issues starting the Apollo Server, where it would not initialize properly.
- **Error Message Encountered**: `Error: Cannot find module 'apollo-server'.`

### Resolution Steps
1. Rechecked package installation and discovered that I had misspelled 'apollo-server' during the package installation (installed `graphql` but skipped setting up Apollo server correctly).
2. Re-ran the installation command correctly (`npm install apollo-server graphql`).
3. Successfully re-initialized the server and accessed the GraphQL playground.

### Blocker 4: Testing Various Queries and Handling Responses
- **What Happened**: Queries ran successfully but did not filter as expected (e.g., filtering out stock items).

### Resolution Steps
1. Analyzed resolver logic to confirm it was correctly filtering based on the `status` field.
2. Uncovered that I was testing the wrong ID values in queries for `getOutOfStock` as I had not reviewed the data set sufficiently.
3. Retested using correct IDs, which led to successful filtering.

### Final Testing
- Completed full-end to-end testing to ensure all queries returned expected results based on the hardcoded inventory. This validation process took rigorous fine-tuning for accuracy.

---

## Summary

### Key Takeaways
- Understanding GraphQL's syntax and the structure of responses is essential, especially when transitioning from traditional REST APIs.
- Encountering and resolving blockers independently enhances learning and builds troubleshooting skills.
- Using structured resources can significantly assist with confused concepts.

### Total Time Spent: ~15 hours (8 hours on Day 1, 7 hours on Day 2)

### Self-Assessment of Readiness for Day 3 Team Build
- Overall, I am feeling much more confident in my ability to implement basic GraphQL services and queries. I have learned the basics of building a GraphQL prototype and am excited to collaborate and leverage my learnings in the team build phase.