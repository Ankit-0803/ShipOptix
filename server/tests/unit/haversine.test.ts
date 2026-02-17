/**
 * Unit Tests: Haversine Distance Formula
 * Tests the Haversine implementation with known city pairs,
 * zero distance, and edge cases.
 */
import { describe, it, expect } from "vitest";
import { haversineDistance } from "../../src/utils/haversine.js";

describe("Haversine Distance Formula", () => {
    it("should return 0 for identical coordinates", () => {
        const distance = haversineDistance(12.9716, 77.5946, 12.9716, 77.5946);
        expect(distance).toBe(0);
    });

    it("should calculate Bangalore to Mumbai correctly (~845 km)", () => {
        // Bangalore: 12.9716°N, 77.5946°E
        // Mumbai: 19.0760°N, 72.8777°E
        const distance = haversineDistance(12.9716, 77.5946, 19.076, 72.8777);
        expect(distance).toBeGreaterThan(800);
        expect(distance).toBeLessThan(900);
    });

    it("should calculate Delhi to Chennai correctly (~1750 km)", () => {
        // Delhi: 28.7041°N, 77.1025°E
        // Chennai: 13.0827°N, 80.2707°E
        const distance = haversineDistance(28.7041, 77.1025, 13.0827, 80.2707);
        expect(distance).toBeGreaterThan(1700);
        expect(distance).toBeLessThan(1800);
    });

    it("should calculate short distance (~50 km) for nearby cities", () => {
        // Bangalore: 12.9716°N, 77.5946°E
        // Hosur: 12.7377°N, 77.8253°E (near Bangalore, ~35-40 km)
        const distance = haversineDistance(12.9716, 77.5946, 12.7377, 77.8253);
        expect(distance).toBeGreaterThan(30);
        expect(distance).toBeLessThan(50);
    });

    it("should handle equator crossing correctly", () => {
        const distance = haversineDistance(1.0, 77.0, -1.0, 77.0);
        expect(distance).toBeGreaterThan(200);
        expect(distance).toBeLessThan(230);
    });

    it("should be symmetric (A→B == B→A)", () => {
        const d1 = haversineDistance(12.9716, 77.5946, 19.076, 72.8777);
        const d2 = haversineDistance(19.076, 72.8777, 12.9716, 77.5946);
        expect(Math.abs(d1 - d2)).toBeLessThan(0.001);
    });
});
