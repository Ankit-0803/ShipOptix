/**
 * Database Migration Runner
 * Creates all tables defined in the schema if they don't exist.
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

async function migrate() {
  console.log(`🔄 Running migrations (Target: ${process.env.NEON_HOST || "default"})...\n`);

  try {
    await client.connect();
    console.log("  🔌 Connected to database");

    // Create customers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(100),
        address TEXT,
        city VARCHAR(50),
        status VARCHAR(20) DEFAULT 'active',
        latitude NUMERIC(10, 6) NOT NULL,
        longitude NUMERIC(10, 6) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("  ✅ customers table ready");

    // Create sellers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        contact_person VARCHAR(100),
        phone VARCHAR(15),
        email VARCHAR(100),
        address TEXT,
        city VARCHAR(50),
        latitude NUMERIC(10, 6) NOT NULL,
        longitude NUMERIC(10, 6) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("  ✅ sellers table ready");

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER NOT NULL REFERENCES sellers(id),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        weight_kg NUMERIC(8, 3) NOT NULL,
        length_cm NUMERIC(8, 2),
        width_cm NUMERIC(8, 2),
        height_cm NUMERIC(8, 2),
        category VARCHAR(50),
        sku VARCHAR(50),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("  ✅ products table ready");

    // Create warehouses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS warehouses (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        city VARCHAR(50),
        latitude NUMERIC(10, 6) NOT NULL,
        longitude NUMERIC(10, 6) NOT NULL,
        capacity_sqft INTEGER,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("  ✅ warehouses table ready");

    console.log("\n✅ All migrations completed successfully!");
  } catch (error: any) {
    console.error("❌ Migration failed:");
    console.error("  Message:", error.message);
    console.error("  Code:", error.code);
    if (error.cause) console.error("  Cause:", error.cause);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
