/**
 * Express Server Entry Point
 * B2B E-Commerce Shipping Charge Estimator API
 *
 * Features:
 *   - REST API for shipping charge calculations
 *   - Haversine-based distance calculations
 *   - Transport mode & delivery speed strategies
 *   - In-memory caching (1hr TTL)
 *   - PostgreSQL (Neon DB) with Drizzle ORM
 *   - Zod request validation
 *   - CORS enabled
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import warehouseRoutes from "./routes/warehouse.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";
import entityRoutes from "./routes/entity.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "B2B Shipping Charge Estimator",
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes ──────────────────────────────────
app.use("/api/v1/warehouse", warehouseRoutes);      // Warehouse operations
app.use("/api/v1/warehouses", warehouseRoutes);      // Alias for listing
app.use("/api/v1/shipping-charge", shippingRoutes);  // Shipping calculations
app.use("/api/v1", entityRoutes);                     // Entity listings

// ─── 404 Handler ─────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        error: true,
        message: "Endpoint not found",
        statusCode: 404,
    });
});

// ─── Error Handler ───────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 B2B Shipping Estimator API running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📦 API Base URL: http://localhost:${PORT}/api/v1\n`);
});

export default app;
