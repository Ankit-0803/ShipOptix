/**
 * Shipping Service
 * Core business logic for calculating shipping charges.
 * Combines distance calculation, transport mode selection,
 * and delivery speed surcharges.
 */
import { WarehouseRepository } from "../repositories/warehouse.repository.js";
import { CustomerRepository } from "../repositories/customer.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { DistanceService } from "./distance.service.js";
import { transportStrategy } from "../strategies/transport.strategy.js";
import { getDeliveryStrategy } from "../strategies/delivery.strategy.js";
import { WarehouseService } from "./warehouse.service.js";
import type {
    DeliverySpeed,
    ShippingChargeResponse,
    CombinedShippingResponse,
} from "../types/index.js";

export class ShippingService {
    /**
     * Calculate shipping charge from a warehouse to a customer.
     *
     * Steps:
     *   1. Validate warehouse, customer, and product exist
     *   2. Calculate Haversine distance (warehouse → customer)
     *   3. Determine transport mode from distance
     *   4. Compute base charge: rate × distance × weight
     *   5. Apply delivery speed surcharge
     *
     * @param warehouseId - Source warehouse ID
     * @param customerId - Destination customer ID
     * @param productId - Product ID (for weight lookup)
     * @param deliverySpeed - "standard" or "express"
     * @returns Shipping charge in ₹
     */
    static async calculateShippingCharge(
        warehouseId: string,
        customerId: string,
        productId: number,
        deliverySpeed: DeliverySpeed
    ): Promise<ShippingChargeResponse> {
        // Validate warehouse
        const warehouse = await WarehouseRepository.findById(warehouseId);
        if (!warehouse) {
            throw { statusCode: 404, message: `Warehouse with ID "${warehouseId}" not found` };
        }

        // Validate customer
        const customer = await CustomerRepository.findById(customerId);
        if (!customer) {
            throw { statusCode: 404, message: `Customer with ID "${customerId}" not found` };
        }

        // Validate product
        const product = await ProductRepository.findById(productId);
        if (!product) {
            throw { statusCode: 404, message: `Product with ID ${productId} not found` };
        }

        // Calculate distance between warehouse and customer
        const distance = DistanceService.calculate(
            `wh:${warehouseId}`,
            parseFloat(warehouse.latitude),
            parseFloat(warehouse.longitude),
            `cust:${customerId}`,
            parseFloat(customer.latitude),
            parseFloat(customer.longitude)
        );

        const weightKg = parseFloat(product.weightKg);

        // Calculate base charge using transport strategy
        const baseCharge = transportStrategy.calculateBaseCharge(distance, weightKg);

        // Apply delivery speed surcharge
        const deliveryStrategyInstance = getDeliveryStrategy(deliverySpeed);
        const finalCharge = deliveryStrategyInstance.calculateFinalCharge(baseCharge, weightKg);

        return {
            shippingCharge: Math.round(finalCharge * 100) / 100, // Round to 2 decimal places
        };
    }

    /**
     * Combined calculation: Find nearest warehouse + calculate shipping charge.
     *
     * @param sellerId - Seller ID (to find nearest warehouse)
     * @param customerId - Customer ID (destination)
     * @param productId - Product ID
     * @param deliverySpeed - "standard" or "express"
     * @returns Shipping charge + nearest warehouse info
     */
    static async calculateCombined(
        sellerId: number,
        customerId: string,
        productId: number,
        deliverySpeed: DeliverySpeed
    ): Promise<CombinedShippingResponse> {
        // Step 1: Find nearest warehouse to the seller
        const nearestWarehouse = await WarehouseService.findNearestWarehouse(
            sellerId,
            productId
        );

        // Step 2: Calculate shipping charge from warehouse to customer
        const { shippingCharge } = await ShippingService.calculateShippingCharge(
            nearestWarehouse.warehouseId,
            customerId,
            productId,
            deliverySpeed
        );

        return {
            shippingCharge,
            nearestWarehouse,
        };
    }
}
