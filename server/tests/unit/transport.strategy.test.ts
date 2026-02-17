/**
 * Unit Tests: Transport Strategy
 * Tests transport mode selection and base charge calculation
 * for all distance ranges and boundary conditions.
 */
import { describe, it, expect } from "vitest";
import { TransportStrategy } from "../../src/strategies/transport.strategy.js";

const strategy = new TransportStrategy();

describe("Transport Strategy", () => {
    describe("getTransportMode", () => {
        it("should return Mini Van for 0-100 km", () => {
            const mode = strategy.getTransportMode(50);
            expect(mode.mode).toBe("mini_van");
            expect(mode.ratePerKmPerKg).toBe(3);
        });

        it("should return Truck for 100-500 km", () => {
            const mode = strategy.getTransportMode(250);
            expect(mode.mode).toBe("truck");
            expect(mode.ratePerKmPerKg).toBe(2);
        });

        it("should return Aeroplane for > 500 km", () => {
            const mode = strategy.getTransportMode(800);
            expect(mode.mode).toBe("aeroplane");
            expect(mode.ratePerKmPerKg).toBe(1);
        });

        // Boundary tests
        it("should return Mini Van at exactly 0 km", () => {
            const mode = strategy.getTransportMode(0);
            expect(mode.mode).toBe("mini_van");
        });

        it("should return Mini Van at 99.99 km", () => {
            const mode = strategy.getTransportMode(99.99);
            expect(mode.mode).toBe("mini_van");
        });

        it("should return Truck at exactly 100 km", () => {
            const mode = strategy.getTransportMode(100);
            expect(mode.mode).toBe("truck");
        });

        it("should return Truck at 499.99 km", () => {
            const mode = strategy.getTransportMode(499.99);
            expect(mode.mode).toBe("truck");
        });

        it("should return Aeroplane at exactly 500 km", () => {
            const mode = strategy.getTransportMode(500);
            expect(mode.mode).toBe("aeroplane");
        });
    });

    describe("calculateBaseCharge", () => {
        it("should calculate Mini Van charge: 3 × distance × weight", () => {
            // 50 km, 2 kg → 3 × 50 × 2 = 300
            const charge = strategy.calculateBaseCharge(50, 2);
            expect(charge).toBe(300);
        });

        it("should calculate Truck charge: 2 × distance × weight", () => {
            // 200 km, 5 kg → 2 × 200 × 5 = 2000
            const charge = strategy.calculateBaseCharge(200, 5);
            expect(charge).toBe(2000);
        });

        it("should calculate Aeroplane charge: 1 × distance × weight", () => {
            // 800 km, 10 kg → 1 × 800 × 10 = 8000
            const charge = strategy.calculateBaseCharge(800, 10);
            expect(charge).toBe(8000);
        });

        it("should handle fractional weights correctly", () => {
            // 50 km, 0.5 kg → 3 × 50 × 0.5 = 75
            const charge = strategy.calculateBaseCharge(50, 0.5);
            expect(charge).toBe(75);
        });
    });
});
