/**
 * Warehouse Factory (Factory Pattern)
 * Encapsulates warehouse creation and selection logic.
 * Provides a centralized interface for warehouse-related operations.
 */
import { WarehouseService } from "../services/warehouse.service.js";
import { WarehouseRepository } from "../repositories/warehouse.repository.js";
import type { WarehouseLocationResponse } from "../types/index.js";

export class WarehouseFactory {
    /**
     * Create a warehouse location response from raw warehouse data.
     * Factory method to standardize response format.
     */
    static createLocationResponse(warehouse: {
        id: string;
        latitude: string;
        longitude: string;
    }): WarehouseLocationResponse {
        return {
            warehouseId: warehouse.id,
            warehouseLocation: {
                lat: parseFloat(warehouse.latitude),
                long: parseFloat(warehouse.longitude),
            },
        };
    }

    /**
     * Select the optimal warehouse for a seller and product.
     * Delegates to WarehouseService for nearest-warehouse logic.
     */
    static async selectOptimalWarehouse(
        sellerId: number,
        productId: number
    ): Promise<WarehouseLocationResponse> {
        return WarehouseService.findNearestWarehouse(sellerId, productId);
    }

    /**
     * Get all available warehouses as location responses.
     */
    static async getAllWarehouses(): Promise<WarehouseLocationResponse[]> {
        const warehouses = await WarehouseRepository.findAll();
        return warehouses.map((wh) => this.createLocationResponse(wh));
    }
}
