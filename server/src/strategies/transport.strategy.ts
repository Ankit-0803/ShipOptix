/**
 * Transport Strategy (Strategy Pattern)
 *
 * Selects transport mode and calculates base shipping charge
 * based on the distance between warehouse and customer.
 *
 * Modes:
 *   - Aeroplane: > 500 km  → ₹1/km/kg
 *   - Truck:     100–500 km → ₹2/km/kg
 *   - Mini Van:  0–100 km   → ₹3/km/kg
 *
 * Extensible: add new transport modes by adding entries to TRANSPORT_MODES array.
 */
import type { TransportConfig, TransportMode } from "../types/index.js";

// ─── Transport Mode Configurations ───────────────
const TRANSPORT_MODES: TransportConfig[] = [
    {
        mode: "aeroplane",
        minDistance: 500,
        maxDistance: Infinity,
        ratePerKmPerKg: 1,
    },
    {
        mode: "truck",
        minDistance: 100,
        maxDistance: 500,
        ratePerKmPerKg: 2,
    },
    {
        mode: "mini_van",
        minDistance: 0,
        maxDistance: 100,
        ratePerKmPerKg: 3,
    },
];

/**
 * Interface for transport strategy
 */
export interface ITransportStrategy {
    getTransportMode(distanceKm: number): TransportConfig;
    calculateBaseCharge(distanceKm: number, weightKg: number): number;
}

/**
 * Concrete transport strategy implementation.
 * Uses distance ranges to determine appropriate transport mode and rate.
 */
export class TransportStrategy implements ITransportStrategy {
    private modes: TransportConfig[];

    constructor(modes: TransportConfig[] = TRANSPORT_MODES) {
        this.modes = modes;
    }

    /**
     * Determine the transport mode for a given distance.
     * @param distanceKm - Distance in kilometers
     * @returns TransportConfig for the matching mode
     * @throws Error if no mode matches the distance
     */
    getTransportMode(distanceKm: number): TransportConfig {
        const mode = this.modes.find(
            (m) => distanceKm >= m.minDistance && distanceKm < m.maxDistance
        );

        if (!mode) {
            throw new Error(
                `No transport mode available for distance: ${distanceKm.toFixed(2)} km`
            );
        }

        return mode;
    }

    /**
     * Calculate base shipping charge.
     * Formula: rate × distance × weight
     *
     * @param distanceKm - Distance in kilometers
     * @param weightKg - Product weight in kilograms
     * @returns Base charge in ₹
     */
    calculateBaseCharge(distanceKm: number, weightKg: number): number {
        const mode = this.getTransportMode(distanceKm);
        return mode.ratePerKmPerKg * distanceKm * weightKg;
    }
}

/** Default transport strategy instance */
export const transportStrategy = new TransportStrategy();
