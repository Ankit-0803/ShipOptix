/**
 * Seller Repository (Repository Pattern)
 * Encapsulates all database operations for the sellers table.
 */
import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { sellers } from "../db/schema.js";

export class SellerRepository {
    /**
     * Find a seller by their ID
     * @param id - Seller ID (numeric)
     * @returns Seller record or null
     */
    static async findById(id: number) {
        const results = await db
            .select()
            .from(sellers)
            .where(eq(sellers.id, id))
            .limit(1);
        return results[0] || null;
    }

    /**
     * Get all sellers
     */
    static async findAll() {
        return db.select().from(sellers);
    }
}
