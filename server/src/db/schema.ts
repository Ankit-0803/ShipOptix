/**
 * Database Schema Definitions
 * Defines all entity tables with Drizzle ORM for the B2B shipping estimator.
 * Tables: customers, sellers, products, warehouses
 */
import {
    pgTable,
    varchar,
    text,
    numeric,
    integer,
    timestamp,
    serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────────
// CUSTOMERS (Kirana Stores)
// ─────────────────────────────────────────────────
export const customers = pgTable("customers", {
    id: varchar("id", { length: 20 }).primaryKey(),        // e.g. "Cust-123"
    name: varchar("name", { length: 100 }).notNull(),       // Store name
    phone: varchar("phone", { length: 15 }).notNull(),
    email: varchar("email", { length: 100 }),               // Creative field
    address: text("address"),                                // Full address
    city: varchar("city", { length: 50 }),
    status: varchar("status", { length: 20 }).default("active"),
    latitude: numeric("latitude", { precision: 10, scale: 6 }).notNull(),
    longitude: numeric("longitude", { precision: 10, scale: 6 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ─────────────────────────────────────────────────
// SELLERS
// ─────────────────────────────────────────────────
export const sellers = pgTable("sellers", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    contactPerson: varchar("contact_person", { length: 100 }),
    phone: varchar("phone", { length: 15 }),
    email: varchar("email", { length: 100 }),
    address: text("address"),
    city: varchar("city", { length: 50 }),
    latitude: numeric("latitude", { precision: 10, scale: 6 }).notNull(),
    longitude: numeric("longitude", { precision: 10, scale: 6 }).notNull(),
    status: varchar("status", { length: 20 }).default("active"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ─────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────
export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    sellerId: integer("seller_id")
        .notNull()
        .references(() => sellers.id),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    weightKg: numeric("weight_kg", { precision: 8, scale: 3 }).notNull(),
    lengthCm: numeric("length_cm", { precision: 8, scale: 2 }),
    widthCm: numeric("width_cm", { precision: 8, scale: 2 }),
    heightCm: numeric("height_cm", { precision: 8, scale: 2 }),
    category: varchar("category", { length: 50 }),           // Creative field
    sku: varchar("sku", { length: 50 }),                      // Stock Keeping Unit
    status: varchar("status", { length: 20 }).default("active"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ─────────────────────────────────────────────────
// WAREHOUSES
// ─────────────────────────────────────────────────
export const warehouses = pgTable("warehouses", {
    id: varchar("id", { length: 20 }).primaryKey(),          // e.g. "WH-BLR-001"
    name: varchar("name", { length: 100 }).notNull(),
    address: text("address"),
    city: varchar("city", { length: 50 }),
    latitude: numeric("latitude", { precision: 10, scale: 6 }).notNull(),
    longitude: numeric("longitude", { precision: 10, scale: 6 }).notNull(),
    capacitySqft: integer("capacity_sqft"),                   // Creative field
    status: varchar("status", { length: 20 }).default("active"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ─────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────
export const sellersRelations = relations(sellers, ({ many }) => ({
    products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
    seller: one(sellers, {
        fields: [products.sellerId],
        references: [sellers.id],
    }),
}));
