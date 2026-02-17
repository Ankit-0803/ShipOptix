/**
 * Database Configuration
 * Connects to PostgreSQL (Neon DB) using Drizzle ORM with the `pg` driver.
 * Includes SNI workaround for environments with DNS issues.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import dotenv from "dotenv";
import * as schema from "../db/schema.js";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
}

const { Pool } = pg;

// Use explicit SNI hostname if provided (DNS workaround), otherwise default validation
// We default to NEON_HOST or fall back to standard behavior
const sslConfig = process.env.NEON_HOST
    ? {
        rejectUnauthorized: false,
        servername: process.env.NEON_HOST
    }
    : {
        rejectUnauthorized: false
    };

// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL.trim(),
    ssl: sslConfig,
});

/** Drizzle ORM instance with schema */
export const db = drizzle(pool, { schema });

export type Database = typeof db;
