/**
 * Global Error Handler Middleware
 * Catches all errors thrown in route handlers and returns
 * a consistent JSON error response.
 */
import { Request, Response, NextFunction } from "express";
import type { ApiError } from "../types/index.js";

/**
 * Express error handling middleware.
 * Handles known errors (with statusCode) and unexpected errors.
 */
export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Known application errors (thrown with statusCode)
    if (err.statusCode) {
        const apiError: ApiError = {
            error: true,
            message: err.message || "An error occurred",
            statusCode: err.statusCode,
        };
        res.status(err.statusCode).json(apiError);
        return;
    }

    // Zod validation errors
    if (err.name === "ZodError") {
        const apiError: ApiError = {
            error: true,
            message: `Validation error: ${err.errors?.map((e: any) => e.message).join(", ")}`,
            statusCode: 400,
        };
        res.status(400).json(apiError);
        return;
    }

    // Unexpected errors
    console.error("Unexpected error:", err);
    const apiError: ApiError = {
        error: true,
        message: "Internal server error",
        statusCode: 500,
    };
    res.status(500).json(apiError);
}
