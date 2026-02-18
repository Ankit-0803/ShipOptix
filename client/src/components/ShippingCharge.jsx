import { useState } from "react";
import { API_BASE_URL } from "../config";

/**
 * Shipping Charge Calculator Form
 * GET /api/v1/shipping-charge?warehouseId=X&customerId=Y&productId=Z&deliverySpeed=standard
 */
function ShippingCharge({ warehouses, customers, products }) {
    const [warehouseId, setWarehouseId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [productId, setProductId] = useState("");
    const [deliverySpeed, setDeliverySpeed] = useState("standard");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        setLoading(true);

        try {
            const params = new URLSearchParams({
                warehouseId, customerId, productId, deliverySpeed,
            });
            const res = await fetch(`${API_BASE_URL}/api/v1/shipping-charge?${params}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to calculate shipping charge");
            } else {
                setResult(data);
            }
        } catch (err) {
            setError("Network error. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card">
            <div className="card-header">
                <div className="card-header-icon" style={{ background: "rgba(245,158,11,0.15)" }}>💰</div>
                <div>
                    <h2>Calculate Shipping Charge</h2>
                    <p>From a specific warehouse to a customer</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Warehouse</label>
                        <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} required>
                            <option value="">Select warehouse...</option>
                            {warehouses.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name} ({w.city})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Customer</label>
                        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                            <option value="">Select customer...</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({c.city})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Product</label>
                        <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
                            <option value="">Select product...</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} — {p.weightKg}kg
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Delivery Speed</label>
                        <select value={deliverySpeed} onChange={(e) => setDeliverySpeed(e.target.value)}>
                            <option value="standard">🚚 Standard</option>
                            <option value="express">⚡ Express</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <span className="loading-spinner" /> : "📊"} Calculate
                </button>
            </form>

            {error && <div className="error-msg">⚠️ {error}</div>}

            {result && (
                <div className="result-container">
                    <div className="result-card">
                        <div className="charge-label">Shipping Charge</div>
                        <div className="charge-value">₹{result.shippingCharge?.toFixed(2)}</div>
                        <div className="result-details">
                            <div className="result-detail">
                                <span className="detail-label">Delivery Speed</span>
                                <span className="detail-value" style={{ textTransform: "capitalize" }}>{deliverySpeed}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShippingCharge;
