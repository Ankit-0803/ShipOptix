/**
 * Unit Tests: Delivery Speed Strategy
 * Tests Standard and Express delivery charge calculations.
 */
import { describe, it, expect } from "vitest";
import { getDeliveryStrategy } from "../../src/strategies/delivery.strategy.js";

describe("Delivery Speed Strategy", () => {
    describe("Standard Delivery", () => {
        const standard = getDeliveryStrategy("standard");

        it("should return base charge without any extra", () => {
            const finalCharge = standard.calculateFinalCharge(100, 5);
            expect(finalCharge).toBe(100);
        });

        it("should work with zero base charge", () => {
            const finalCharge = standard.calculateFinalCharge(0, 5);
            expect(finalCharge).toBe(0);
        });
    });

    describe("Express Delivery", () => {
        const express = getDeliveryStrategy("express");

        it("should add ₹10 flat + ₹1.2/kg to base charge", () => {
            // base=100, weight=5 → 100 + 10 + (1.2 × 5) = 116
            const finalCharge = express.calculateFinalCharge(100, 5);
            expect(finalCharge).toBe(116);
        });

        it("should handle fractional weights", () => {
            // base=50, weight=0.5 → 50 + 10 + (1.2 × 0.5) = 60.6
            const finalCharge = express.calculateFinalCharge(50, 0.5);
            expect(finalCharge).toBeCloseTo(60.6, 2);
        });

        it("should handle zero base charge", () => {
            // base=0, weight=10 → 0 + 10 + (1.2 × 10) = 22
            const finalCharge = express.calculateFinalCharge(0, 10);
            expect(finalCharge).toBe(22);
        });

        it("should handle heavy items correctly", () => {
            // base=8000, weight=25 → 8000 + 10 + (1.2 × 25) = 8040
            const finalCharge = express.calculateFinalCharge(8000, 25);
            expect(finalCharge).toBe(8040);
        });
    });

    describe("Invalid Speed", () => {
        it("should throw for unsupported delivery speed", () => {
            expect(() => getDeliveryStrategy("overnight" as any)).toThrow(
                "Unsupported delivery speed"
            );
        });
    });
});
