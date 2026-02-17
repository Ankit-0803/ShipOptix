/**
 * Entity Listing Routes
 * Provides endpoints to list all entities (customers, sellers, products)
 * for the frontend UI.
 */
import { Router, Request, Response, NextFunction } from "express";
import { CustomerRepository } from "../repositories/customer.repository.js";
import { SellerRepository } from "../repositories/seller.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";

const router = Router();

// ─── GET /api/v1/customers ───────────────────────
router.get(
    "/customers",
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const customers = await CustomerRepository.findAll();
            res.json(customers);
        } catch (err) {
            next(err);
        }
    }
);

// ─── GET /api/v1/sellers ─────────────────────────
router.get(
    "/sellers",
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const sellers = await SellerRepository.findAll();
            res.json(sellers);
        } catch (err) {
            next(err);
        }
    }
);

// ─── GET /api/v1/products ────────────────────────
router.get(
    "/products",
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await ProductRepository.findAllWithSeller();
            res.json(products);
        } catch (err) {
            next(err);
        }
    }
);

export default router;
