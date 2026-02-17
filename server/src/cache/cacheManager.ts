/**
 * Cache Manager
 * In-memory cache using node-cache with configurable TTL.
 * Used for caching nearest warehouse lookups and distance calculations
 * to reduce redundant DB queries and Haversine computations.
 */
import NodeCache from "node-cache";

/** Default TTL: 1 hour (3600 seconds) */
const DEFAULT_TTL = 3600;

class CacheManager {
    private cache: NodeCache;

    constructor(ttlSeconds: number = DEFAULT_TTL) {
        this.cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
            useClones: false,
        });
    }

    /**
     * Get a value from cache
     * @param key - Cache key
     * @returns Cached value or undefined
     */
    get<T>(key: string): T | undefined {
        return this.cache.get<T>(key);
    }

    /**
     * Set a value in cache
     * @param key - Cache key
     * @param value - Value to cache
     * @param ttl - Optional custom TTL in seconds
     */
    set<T>(key: string, value: T, ttl?: number): void {
        if (ttl) {
            this.cache.set(key, value, ttl);
        } else {
            this.cache.set(key, value);
        }
    }

    /**
     * Delete a specific key from cache
     */
    delete(key: string): void {
        this.cache.del(key);
    }

    /**
     * Flush all cached entries
     */
    flush(): void {
        this.cache.flushAll();
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return this.cache.getStats();
    }
}

/** Singleton cache instance for the application */
export const cacheManager = new CacheManager();
