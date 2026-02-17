/**
 * Request Validation Middleware
 * Uses Zod schemas to validate query params, route params, and request bodies.
 */
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Validate query parameters against a Zod schema.
 * Passes parsed data via res.locals.validatedQuery.
 */
export function validateQuery(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req.query);
            res.locals.validatedQuery = parsed;
            next();
        } catch (err) {
            next(err);
        }
    };
}

/**
 * Validate request body against a Zod schema.
 * Passes parsed data via res.locals.validatedBody.
 */
export function validateBody(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req.body);
            res.locals.validatedBody = parsed;
            next();
        } catch (err) {
            next(err);
        }
    };
}
