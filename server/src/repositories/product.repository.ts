/**
 * Product Repository (Repository Pattern)
 * Encapsulates all database operations for the products table.
 */
import { eq, and } from "drizzle-orm";
import { db } from "../config/database.js";
import { products, sellers } from "../db/schema.js";

export class ProductRepository {
    /**
     * Find a product by its ID
     * @param id - Product ID (numeric)
     * @returns Product record or null
     */
    static async findById(id: number) {
        const results = await db
            .select()
            .from(products)
            .where(eq(products.id, id))
            .limit(1);
        return results[0] || null;
    }

    /**
     * Find a product by ID and verify it belongs to a given seller
     * @param productId - Product ID
     * @param sellerId - Seller ID to verify ownership
     * @returns Product record or null
     */
    static async findByIdAndSeller(productId: number, sellerId: number) {
        const results = await db
            .select()
            .from(products)
            .where(and(eq(products.id, productId), eq(products.sellerId, sellerId)))
            .limit(1);
        return results[0] || null;
    }

    /**
     * Get all products (with seller info via join)
     */
    static async findAllWithSeller() {
        return db
            .select({
                id: products.id,
                name: products.name,
                description: products.description,
                price: products.price,
                weightKg: products.weightKg,
                lengthCm: products.lengthCm,
                widthCm: products.widthCm,
                heightCm: products.heightCm,
                category: products.category,
                sku: products.sku,
                status: products.status,
                sellerId: products.sellerId,
                sellerName: sellers.name,
            })
            .from(products)
            .leftJoin(sellers, eq(products.sellerId, sellers.id));
    }
}
