/**
 * Warehouse Repository (Repository Pattern)
 * Encapsulates all database operations for the warehouses table.
 */
import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { warehouses } from "../db/schema.js";

export class WarehouseRepository {
    /**
     * Find a warehouse by its ID
     * @param id - Warehouse ID (e.g. "WH-BLR-001")
     * @returns Warehouse record or null
     */
    static async findById(id: string) {
        const results = await db
            .select()
            .from(warehouses)
            .where(eq(warehouses.id, id))
            .limit(1);
        return results[0] || null;
    }

    /**
     * Get all warehouses
     */
    static async findAll() {
        return db.select().from(warehouses);
    }
}
