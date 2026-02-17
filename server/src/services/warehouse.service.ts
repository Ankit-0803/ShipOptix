/**
 * Warehouse Service
 * Business logic for warehouse operations, including finding
 * the nearest warehouse to a seller's location.
 */
import { WarehouseRepository } from "../repositories/warehouse.repository.js";
import { SellerRepository } from "../repositories/seller.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { DistanceService } from "./distance.service.js";
import { cacheManager } from "../cache/cacheManager.js";
import type { WarehouseLocationResponse } from "../types/index.js";

export class WarehouseService {
    /**
     * Find the nearest warehouse to a given seller.
     * Uses caching to avoid re-computation for the same seller.
     *
     * @param sellerId - Seller ID
     * @param productId - Product ID (validated to belong to the seller)
     * @returns Nearest warehouse ID and location
     * @throws Error if seller, product, or warehouses not found
     */
    static async findNearestWarehouse(
        sellerId: number,
        productId: number
    ): Promise<WarehouseLocationResponse> {
        // Check cache
        const cacheKey = `nearest:${sellerId}`;
        const cached = cacheManager.get<WarehouseLocationResponse>(cacheKey);
        if (cached) {
            return cached;
        }

        // Validate seller exists
        const seller = await SellerRepository.findById(sellerId);
        if (!seller) {
            throw { statusCode: 404, message: `Seller with ID ${sellerId} not found` };
        }

        // Validate product exists and belongs to seller
        const product = await ProductRepository.findByIdAndSeller(productId, sellerId);
        if (!product) {
            throw {
                statusCode: 404,
                message: `Product with ID ${productId} not found for seller ${sellerId}`,
            };
        }

        // Get all warehouses
        const warehouseList = await WarehouseRepository.findAll();
        if (warehouseList.length === 0) {
            throw { statusCode: 404, message: "No warehouses available in the system" };
        }

        // Find nearest warehouse using Haversine distance
        let nearestWarehouse = warehouseList[0];
        let minDistance = Infinity;

        const sellerLat = parseFloat(seller.latitude);
        const sellerLng = parseFloat(seller.longitude);

        for (const warehouse of warehouseList) {
            const distance = DistanceService.calculate(
                `seller:${sellerId}`,
                sellerLat,
                sellerLng,
                `wh:${warehouse.id}`,
                parseFloat(warehouse.latitude),
                parseFloat(warehouse.longitude)
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestWarehouse = warehouse;
            }
        }

        const result: WarehouseLocationResponse = {
            warehouseId: nearestWarehouse.id,
            warehouseLocation: {
                lat: parseFloat(nearestWarehouse.latitude),
                long: parseFloat(nearestWarehouse.longitude),
            },
        };

        // Cache the result
        cacheManager.set(cacheKey, result);

        return result;
    }
}
