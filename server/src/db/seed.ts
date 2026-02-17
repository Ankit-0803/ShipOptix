/**
 * Database Seed Script
 * Populates all tables with sample data for development and testing.
 * Uses `pg` driver with DNS workaround for Neon SNI.
 */
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

const { Client } = pg;

// Use explicit SNI hostname if provided (DNS workaround), otherwise default validation
const sslConfig = process.env.NEON_HOST
  ? {
    rejectUnauthorized: false,
    servername: process.env.NEON_HOST
  }
  : {
    rejectUnauthorized: false
  };

// Create connection
const client = new Client({
  connectionString: DATABASE_URL.trim(),
  ssl: sslConfig,
});

async function seed() {
  console.log(`🌱 Seeding database (Target: ${process.env.NEON_HOST || "default"})...\n`);

  try {
    await client.connect();
    console.log("  🔌 Connected to database");

    // ─── Clear existing data (order matters for FK) ───
    await client.query("DELETE FROM products");
    await client.query("DELETE FROM sellers");
    await client.query("DELETE FROM customers");
    await client.query("DELETE FROM warehouses");
    console.log("  🧹 Cleared existing data");

    // ─── Seed Customers (8 Kirana Stores) ─────────────
    await client.query(`
      INSERT INTO customers (id, name, phone, email, address, city, latitude, longitude) VALUES
        ('Cust-123', 'Shree Kirana Store', '9847012345', 'shree@email.com', '42 MG Road, Koramangala', 'Bangalore', 12.934533, 77.626579),
        ('Cust-124', 'Andheri Mini Mart', '9101234567', 'andheri@email.com', '15 Link Road, Andheri West', 'Mumbai', 19.136150, 72.829643),
        ('Cust-125', 'Delhi Grocery Hub', '9876543210', 'delhigrocery@email.com', '88 Chandni Chowk', 'Delhi', 28.650195, 77.231495),
        ('Cust-126', 'Chennai Supermart', '9443212345', 'chennaimart@email.com', '22 Anna Nagar Main Road', 'Chennai', 13.085050, 80.209853),
        ('Cust-127', 'Kolkata Provisions', '9831234567', 'kolkata@email.com', '56 Park Street', 'Kolkata', 22.572646, 88.363895),
        ('Cust-128', 'Pune Fresh Store', '9022334455', 'punefresh@email.com', '12 FC Road, Deccan', 'Pune', 18.516726, 73.856255),
        ('Cust-129', 'Hyderabad Bazaar', '9666778899', 'hydbazaar@email.com', '34 Begumpet', 'Hyderabad', 17.443713, 78.348448),
        ('Cust-130', 'Jaipur General Store', '9414556677', 'jaipurgs@email.com', '78 MI Road', 'Jaipur', 26.912434, 75.787271)
    `);
    console.log("  ✅ 8 customers seeded");

    // ─── Seed Sellers (5 companies) ───────────────────
    await client.query(`
      INSERT INTO sellers (id, name, contact_person, phone, email, address, city, latitude, longitude) VALUES
        (1, 'Nestle India Pvt Ltd', 'Rajesh Kumar', '9876001001', 'nestle@business.com', 'Industrial Area Phase 1', 'Gurgaon', 28.459497, 77.026634),
        (2, 'Premium Rice Traders', 'Suresh Reddy', '9876002002', 'rice@business.com', 'APMC Market', 'Guntur', 16.306528, 80.436584),
        (3, 'Sweet Sugar Mills', 'Amit Patel', '9876003003', 'sugar@business.com', 'Sugar Mill Road', 'Kolhapur', 16.705120, 74.243464),
        (4, 'Britannia Foods Ltd', 'Priya Sharma', '9876004004', 'britannia@business.com', 'Whitefield Industrial Estate', 'Bangalore', 12.983800, 77.726600),
        (5, 'Unilever India Ltd', 'Vikram Singh', '9876005005', 'unilever@business.com', 'Andheri East Business District', 'Mumbai', 19.119760, 72.846580)
    `);
    console.log("  ✅ 5 sellers seeded");

    // ─── Seed Products (10 items) ─────────────────────
    await client.query(`
      INSERT INTO products (id, seller_id, name, description, price, weight_kg, length_cm, width_cm, height_cm, category, sku) VALUES
        (1, 1, 'Maggie 500g Packet', 'Instant noodles pack of 12', 10.00, 0.500, 10.00, 10.00, 10.00, 'Instant Food', 'NES-MAG-500'),
        (2, 2, 'Rice Bag 10Kg', 'Premium Basmati rice', 500.00, 10.000, 100.00, 80.00, 50.00, 'Grains', 'RICE-BAS-10K'),
        (3, 3, 'Sugar Bag 25kg', 'Refined white sugar', 700.00, 25.000, 100.00, 90.00, 60.00, 'Sweeteners', 'SUG-REF-25K'),
        (4, 4, 'Bread Loaf 400g', 'Fresh white bread loaf', 45.00, 0.400, 30.00, 12.00, 12.00, 'Bakery', 'BRI-BRD-400'),
        (5, 5, 'Surf Excel 1Kg', 'Washing powder detergent', 180.00, 1.000, 25.00, 18.00, 8.00, 'Household', 'UNI-SRF-1K'),
        (6, 1, 'Nescafe Classic 200g', 'Instant coffee powder', 350.00, 0.200, 8.00, 8.00, 15.00, 'Beverages', 'NES-COF-200'),
        (7, 4, 'Good Day Biscuits 600g', 'Butter cookies pack', 85.00, 0.600, 20.00, 15.00, 5.00, 'Snacks', 'BRI-GDA-600'),
        (8, 5, 'Sunflower Oil 5L', 'Refined sunflower cooking oil', 620.00, 5.000, 30.00, 15.00, 30.00, 'Oils', 'UNI-OIL-5L'),
        (9, 2, 'Toor Dal 5Kg', 'Premium yellow lentils', 450.00, 5.000, 50.00, 40.00, 20.00, 'Pulses', 'RICE-DAL-5K'),
        (10, 3, 'Jaggery Block 2Kg', 'Organic jaggery block', 120.00, 2.000, 20.00, 15.00, 10.00, 'Sweeteners', 'SUG-JAG-2K')
    `);
    console.log("  ✅ 10 products seeded");

    // ─── Seed Warehouses (5 locations) ────────────────
    await client.query(`
      INSERT INTO warehouses (id, name, address, city, latitude, longitude, capacity_sqft) VALUES
        ('WH-BLR-001', 'Bangalore Central Warehouse', 'Industrial Layout, Peenya', 'Bangalore', 12.999990, 77.523273, 50000),
        ('WH-MUM-001', 'Mumbai Distribution Center', 'JNPT Logistics Park, Nhava Sheva', 'Mumbai', 18.949900, 72.923273, 75000),
        ('WH-DEL-001', 'Delhi NCR Warehouse', 'Sector 63, Noida', 'Delhi', 28.627100, 77.376800, 60000),
        ('WH-CHN-001', 'Chennai Logistics Hub', 'Ambattur Industrial Estate', 'Chennai', 13.098600, 80.155200, 45000),
        ('WH-HYD-001', 'Hyderabad Mega Warehouse', 'Shamshabad Logistics Park', 'Hyderabad', 17.240263, 78.429385, 55000)
    `);
    console.log("  ✅ 5 warehouses seeded");

    console.log("\n✅ Database seeded successfully!");
  } catch (error: any) {
    console.error("❌ Seeding failed:");
    console.error("  Message:", error.message);
    if (error.cause) console.error("  Cause:", error.cause);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
