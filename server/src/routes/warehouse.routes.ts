/**
 * Warehouse Routes
 * Handles API endpoints related to warehouse operations.
 *
 * Endpoints:
 *   GET /api/v1/warehouse/nearest   - Find nearest warehouse to a seller
 *   GET /api/v1/warehouses          - List all warehouses
 */
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validateQuery } from "../middleware/validation.js";
import { WarehouseService } from "../services/warehouse.service.js";
import { WarehouseRepository } from "../repositories/warehouse.repository.js";

const router = Router();

// ─── Validation Schemas ──────────────────────────
const nearestWarehouseSchema = z.object({
    sellerId: z
        .string()
        .min(1, "sellerId is required")
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val) && val > 0, "sellerId must be a positive number"),
    productId: z
        .string()
        .min(1, "productId is required")
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val) && val > 0, "productId must be a positive number"),
});

// ─── GET /api/v1/warehouse/nearest ───────────────
router.get(
    "/nearest",
    validateQuery(nearestWarehouseSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sellerId, productId } = res.locals.validatedQuery;
            const result = await WarehouseService.findNearestWarehouse(sellerId, productId);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
);

// ─── GET /api/v1/warehouses ──────────────────────
router.get(
    "/",
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const warehouses = await WarehouseRepository.findAll();
            res.json(warehouses);
        } catch (err) {
            next(err);
        }
    }
);

export default router;
