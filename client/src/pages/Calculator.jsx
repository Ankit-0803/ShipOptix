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

    const [error, setError] = useState(null);

    // Fetch all entities on mount for dropdown population
    useEffect(() => {
        Promise.all([
            fetch(`${API_BASE_URL}/api/v1/sellers`).then((r) => r.ok ? r.json() : []),
            fetch(`${API_BASE_URL}/api/v1/customers`).then((r) => r.ok ? r.json() : []),
            fetch(`${API_BASE_URL}/api/v1/products`).then((r) => r.ok ? r.json() : []),
            fetch(`${API_BASE_URL}/api/v1/warehouses`).then((r) => r.ok ? r.json() : []),
        ]).then(([s, c, p, w]) => {
            if (Array.isArray(s)) setSellers(s);
            if (Array.isArray(c)) setCustomers(c);
            if (Array.isArray(p)) setProducts(p);
            if (Array.isArray(w)) setWarehouses(w);

            if (!Array.isArray(s) || s.length === 0) {
                setError("No data received from API. Please check your Render backend logs and Ensure database migrations were run.");
            }
        }).catch((err) => {
            console.error(err);
            setError("Connection failed. Ensure VITE_API_URL is correct in Vercel settings.");
        });
    }, []);

    if (error) {
        return (
            <div className="calculator-page">
                <div className="error-msg" style={{ margin: "2rem 0", padding: "1.5rem" }}>
                    <h3>⚠️ API Error</h3>
                    <p>{error}</p>
                    <p style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.8 }}>
                        Backend URL: <code>{API_BASE_URL || "Relative (Local Proxy)"}</code>
                    </p>
                </div>
            </div>
        );
    }

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
