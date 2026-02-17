/**
 * Delivery Speed Strategy (Strategy Pattern)
 *
 * Applies delivery speed surcharges on top of the base shipping charge.
 *
 * Speeds:
 *   - Standard: No extra charge (base charge only)
 *   - Express:  +₹10 flat + ₹1.2 per kg
 *
 * Extensible: add new delivery speeds by registering new strategy functions.
 */
import type { DeliverySpeed } from "../types/index.js";

/**
 * Interface for a delivery speed calculator
 */
export interface IDeliverySpeedStrategy {
    calculateFinalCharge(baseCharge: number, weightKg: number): number;
}

/**
 * Standard delivery — no additional charges
 */
class StandardDelivery implements IDeliverySpeedStrategy {
    calculateFinalCharge(baseCharge: number, _weightKg: number): number {
        return baseCharge;
    }
}

/**
 * Express delivery — adds ₹10 flat fee + ₹1.2 per kg
 */
class ExpressDelivery implements IDeliverySpeedStrategy {
    private static readonly FLAT_FEE = 10;
    private static readonly PER_KG_FEE = 1.2;

    calculateFinalCharge(baseCharge: number, weightKg: number): number {
        return baseCharge + ExpressDelivery.FLAT_FEE + ExpressDelivery.PER_KG_FEE * weightKg;
    }
}

// ─── Strategy Registry ───────────────────────────
const strategies: Record<DeliverySpeed, IDeliverySpeedStrategy> = {
    standard: new StandardDelivery(),
    express: new ExpressDelivery(),
};

/**
 * Get the delivery speed strategy for a given speed type.
 * @param speed - "standard" or "express"
 * @returns IDeliverySpeedStrategy instance
 * @throws Error if speed is not supported
 */
export function getDeliveryStrategy(speed: DeliverySpeed): IDeliverySpeedStrategy {
    const strategy = strategies[speed];
    if (!strategy) {
        throw new Error(
            `Unsupported delivery speed: "${speed}". Valid options: ${Object.keys(strategies).join(", ")}`
        );
    }
    return strategy;
}

/** Supported delivery speed values */
export const SUPPORTED_SPEEDS = Object.keys(strategies) as DeliverySpeed[];
