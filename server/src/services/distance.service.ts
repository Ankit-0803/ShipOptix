/**
 * Distance Service
 * Calculates distances between entities using the Haversine formula.
 * Implements caching to avoid redundant distance calculations.
 */
import { haversineDistance } from "../utils/haversine.js";
import { cacheManager } from "../cache/cacheManager.js";

export class DistanceService {
    /**
     * Calculate distance between two points with caching.
     * Cache key format: "dist:{fromId}:{toId}"
     *
     * @param fromId - Identifier for the origin point
     * @param fromLat - Origin latitude
     * @param fromLng - Origin longitude
     * @param toId - Identifier for the destination point
     * @param toLat - Destination latitude
     * @param toLng - Destination longitude
     * @returns Distance in kilometers
     */
    static calculate(
        fromId: string,
        fromLat: number,
        fromLng: number,
        toId: string,
        toLat: number,
        toLng: number
    ): number {
        const cacheKey = `dist:${fromId}:${toId}`;

        // Check cache first
        const cached = cacheManager.get<number>(cacheKey);
        if (cached !== undefined) {
            return cached;
        }

        // Calculate and cache
        const distance = haversineDistance(fromLat, fromLng, toLat, toLng);
        cacheManager.set(cacheKey, distance);

        return distance;
    }
}
