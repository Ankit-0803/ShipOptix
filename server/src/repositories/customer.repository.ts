/**
 * Customer Repository (Repository Pattern)
 * Encapsulates all database operations for the customers table.
 */
import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { customers } from "../db/schema.js";

export class CustomerRepository {
    /**
     * Find a customer by their ID
     * @param id - Customer ID (e.g. "Cust-123")
     * @returns Customer record or undefined
     */
    static async findById(id: string) {
        const results = await db
            .select()
            .from(customers)
            .where(eq(customers.id, id))
            .limit(1);
        return results[0] || null;
    }

    /**
     * Get all customers
     */
    static async findAll() {
        return db.select().from(customers);
    }
}
