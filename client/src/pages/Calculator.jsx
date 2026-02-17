import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import NearestWarehouse from "../components/NearestWarehouse.jsx";
import ShippingCharge from "../components/ShippingCharge.jsx";
import CombinedCalculator from "../components/CombinedCalculator.jsx";

/**
 * Calculator Page
 * Three tabs for different shipping calculation modes.
 */
function Calculator() {
    const [activeTab, setActiveTab] = useState("nearest");
    const [sellers, setSellers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);

    // Fetch all entities on mount for dropdown population
    useEffect(() => {
        Promise.all([
            fetch(`${API_BASE_URL}/api/v1/sellers`).then((r) => r.json()),
            fetch(`${API_BASE_URL}/api/v1/customers`).then((r) => r.json()),
            fetch(`${API_BASE_URL}/api/v1/products`).then((r) => r.json()),
            fetch(`${API_BASE_URL}/api/v1/warehouses`).then((r) => r.json()),
        ]).then(([s, c, p, w]) => {
            setSellers(s);
            setCustomers(c);
            setProducts(p);
            setWarehouses(w);
        }).catch(console.error);
    }, []);

    return (
        <div className="calculator-page">
            <h1>Shipping Calculator</h1>
            <p>Select a calculation mode below</p>

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === "nearest" ? "active" : ""}`}
                    onClick={() => setActiveTab("nearest")}
                >
                    📍 Nearest Warehouse
                </button>
                <button
                    className={`tab-btn ${activeTab === "charge" ? "active" : ""}`}
                    onClick={() => setActiveTab("charge")}
                >
                    💰 Shipping Charge
                </button>
                <button
                    className={`tab-btn ${activeTab === "combined" ? "active" : ""}`}
                    onClick={() => setActiveTab("combined")}
                >
                    🔗 Combined
                </button>
            </div>

            {activeTab === "nearest" && (
                <NearestWarehouse sellers={sellers} products={products} />
            )}
            {activeTab === "charge" && (
                <ShippingCharge warehouses={warehouses} customers={customers} products={products} />
            )}
            {activeTab === "combined" && (
                <CombinedCalculator sellers={sellers} customers={customers} products={products} />
            )}
        </div>
    );
}

export default Calculator;
