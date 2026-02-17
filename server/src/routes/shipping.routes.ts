/**
 * Shipping Routes
 * Handles API endpoints for shipping charge calculations.
 *
 * Endpoints:
 *   GET  /api/v1/shipping-charge            - Calculate shipping charge
 *   POST /api/v1/shipping-charge/calculate  - Combined: nearest warehouse + charge
 */
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validateQuery, validateBody } from "../middleware/validation.js";
import { ShippingService } from "../services/shipping.service.js";

const router = Router();

// ─── Validation Schemas ──────────────────────────
const shippingChargeQuerySchema = z.object({
    warehouseId: z.string().min(1, "warehouseId is required"),
    customerId: z.string().min(1, "customerId is required"),
    productId: z
        .string()
        .min(1, "productId is required")
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val) && val > 0, "productId must be a positive number"),
    deliverySpeed: z.enum(["standard", "express"], {
        errorMap: () => ({
            message: 'deliverySpeed must be "standard" or "express"',
        }),
    }),
});

const calculateBodySchema = z.object({
    sellerId: z.number().int().positive("sellerId must be a positive integer"),
    customerId: z.string().min(1, "customerId is required"),
    productId: z.number().int().positive("productId must be a positive integer"),
    deliverySpeed: z.enum(["standard", "express"], {
        errorMap: () => ({
            message: 'deliverySpeed must be "standard" or "express"',
        }),
    }),
});

// ─── GET /api/v1/shipping-charge ─────────────────
router.get(
    "/",
    validateQuery(shippingChargeQuerySchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { warehouseId, customerId, productId, deliverySpeed } =
                res.locals.validatedQuery;

            const result = await ShippingService.calculateShippingCharge(
                warehouseId,
                customerId,
                productId,
                deliverySpeed
            );

            res.json(result);
        } catch (err) {
            next(err);
        }
    }
);

// ─── POST /api/v1/shipping-charge/calculate ──────
router.post(
    "/calculate",
    validateBody(calculateBodySchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sellerId, customerId, productId, deliverySpeed } =
                res.locals.validatedBody;

            const result = await ShippingService.calculateCombined(
                sellerId,
                customerId,
                productId,
                deliverySpeed
            );

            res.json(result);
        } catch (err) {
            next(err);
        }
    }
);

export default router;
