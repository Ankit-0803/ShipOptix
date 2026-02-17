# B2B E-Commerce Shipping Charge Estimator

A full-stack application for calculating shipping charges in a B2B e-commerce marketplace serving Kirana stores across India.

## Tech Stack

- **Backend:** Node.js + Express.js + TypeScript
- **Database:** PostgreSQL (Neon DB) + Drizzle ORM
- **Frontend:** React 18 + Vite
- **Validation:** Zod
- **Caching:** node-cache (in-memory, 1hr TTL)
- **Testing:** Vitest

## Quick Start

### Prerequisites
- Node.js 18+
- A PostgreSQL database (Neon DB recommended)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Database

```bash
# In the server/ directory, create a .env file:
cp .env.example .env
```

Edit `server/.env` and set your Neon DB connection string:
```
DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require
```

### 3. Setup Database

```bash
cd server

# Create tables
npm run db:migrate

# Seed sample data (8 customers, 5 sellers, 10 products, 5 warehouses)
npm run db:seed
```

### 4. Run the Application

```bash
# Terminal 1: Start API server (port 3000)
cd server
npm run dev

# Terminal 2: Start React frontend (port 5173)
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

### 5. Run Tests

```bash
cd server
npm test
```

## API Documentation

### Base URL: `http://localhost:3000/api/v1`

### 1. Find Nearest Warehouse
```
GET /warehouse/nearest?sellerId=1&productId=1
```
**Response:**
```json
{
  "warehouseId": "WH-BLR-001",
  "warehouseLocation": { "lat": 12.999990, "long": 77.523273 }
}
```

### 2. Calculate Shipping Charge
```
GET /shipping-charge?warehouseId=WH-BLR-001&customerId=Cust-123&productId=1&deliverySpeed=standard
```
**Response:**
```json
{ "shippingCharge": 150.00 }
```

### 3. Combined Calculation
```
POST /shipping-charge/calculate
Content-Type: application/json

{
  "sellerId": 1,
  "customerId": "Cust-123",
  "productId": 1,
  "deliverySpeed": "express"
}
```
**Response:**
```json
{
  "shippingCharge": 180.00,
  "nearestWarehouse": {
    "warehouseId": "WH-BLR-001",
    "warehouseLocation": { "lat": 12.999990, "long": 77.523273 }
  }
}
```

### Entity Listing
```
GET /customers
GET /sellers
GET /products
GET /warehouses
```

### Error Responses
```json
{
  "error": true,
  "message": "Seller with ID 999 not found",
  "statusCode": 404
}
```

## Transport Modes

| Mode      | Distance     | Rate         |
|-----------|-------------|--------------|
| Aeroplane | > 500 km    | ₹1/km/kg    |
| Truck     | 100-500 km  | ₹2/km/kg    |
| Mini Van  | 0-100 km    | ₹3/km/kg    |

## Delivery Speeds

| Speed    | Extra Charge              |
|----------|--------------------------|
| Standard | None                     |
| Express  | +₹10 flat + ₹1.2/kg     |

## Design Patterns

- **Repository Pattern** — DB access layer (CustomerRepository, SellerRepository, etc.)
- **Strategy Pattern** — Transport mode & delivery speed selection
- **Factory Pattern** — Warehouse creation and selection

## Project Structure

```
jumbotail/
├── server/                 # Express.js API
│   ├── src/
│   │   ├── cache/          # In-memory cache manager
│   │   ├── config/         # DB connection (Neon + Drizzle)
│   │   ├── db/             # Schema, migrations, seed
│   │   ├── factories/      # Warehouse factory
│   │   ├── middleware/      # Error handler, validation
│   │   ├── repositories/   # DB access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── strategies/     # Transport & delivery strategies
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Haversine formula
│   └── tests/              # Vitest unit tests
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Calculator forms
│       └── pages/          # Home, Calculator, Entities
└── README.md
```
