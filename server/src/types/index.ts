/**
 * Shared TypeScript types for the shipping charge estimator.
 * Defines interfaces for API requests, responses, and domain entities.
 */

// ─── Location ────────────────────────────────────
export interface Location {
    lat: number;
    lng: number;
}

// ─── Warehouse Response ──────────────────────────
export interface WarehouseLocationResponse {
    warehouseId: string;
    warehouseLocation: {
        lat: number;
        long: number;
    };
}

// ─── Shipping Charge Response ────────────────────
export interface ShippingChargeResponse {
    shippingCharge: number;
}

// ─── Combined Response ───────────────────────────
export interface CombinedShippingResponse {
    shippingCharge: number;
    nearestWarehouse: WarehouseLocationResponse;
}

// ─── Delivery Speed ──────────────────────────────
export type DeliverySpeed = "standard" | "express";

// ─── Transport Mode ──────────────────────────────
export type TransportMode = "aeroplane" | "truck" | "mini_van";

// ─── Transport Config ────────────────────────────
export interface TransportConfig {
    mode: TransportMode;
    minDistance: number;     // km (inclusive)
    maxDistance: number;     // km (exclusive, Infinity for last tier)
    ratePerKmPerKg: number; // ₹ per km per kg
}

// ─── API Error ───────────────────────────────────
export interface ApiError {
    error: boolean;
    message: string;
    statusCode: number;
}

// ─── Calculate Request Body ──────────────────────
export interface CalculateShippingBody {
    sellerId: number;
    customerId: string;
    productId: number;
    deliverySpeed: DeliverySpeed;
}
