import { useState } from "react";

/**
 * Combined Calculator Form
 * POST /api/v1/shipping-charge/calculate
 * Finds nearest warehouse + calculates shipping in one request.
 */
function CombinedCalculator({ sellers, customers, products }) {
    const [sellerId, setSellerId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [productId, setProductId] = useState("");
    const [deliverySpeed, setDeliverySpeed] = useState("standard");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Filter products by selected seller
    const filteredProducts = sellerId
        ? products.filter((p) => String(p.sellerId) === String(sellerId))
        : products;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        setLoading(true);

        try {
            const res = await fetch("/api/v1/shipping-charge/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sellerId: parseInt(sellerId),
                    customerId,
                    productId: parseInt(productId),
                    deliverySpeed,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to calculate");
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
                <div className="card-header-icon" style={{ background: "rgba(16,185,129,0.15)" }}>🔗</div>
                <div>
                    <h2>Combined Calculator</h2>
                    <p>Auto-finds nearest warehouse and calculates total shipping charge</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Seller</label>
                        <select value={sellerId} onChange={(e) => { setSellerId(e.target.value); setProductId(""); }} required>
                            <option value="">Select seller...</option>
                            {sellers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.city})
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
                            {filteredProducts.map((p) => (
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
                    {loading ? <span className="loading-spinner" /> : "🚀"} Calculate All
                </button>
            </form>

            {error && <div className="error-msg">⚠️ {error}</div>}

            {result && (
                <div className="result-container">
                    <div className="result-card">
                        <div className="charge-label">Total Shipping Charge</div>
                        <div className="charge-value">₹{result.shippingCharge?.toFixed(2)}</div>
                        <div className="result-details">
                            <div className="result-detail">
                                <span className="detail-label">Nearest Warehouse</span>
                                <span className="detail-value">{result.nearestWarehouse?.warehouseId}</span>
                            </div>
                            <div className="result-detail">
                                <span className="detail-label">Warehouse Lat</span>
                                <span className="detail-value">{result.nearestWarehouse?.warehouseLocation?.lat}</span>
                            </div>
                            <div className="result-detail">
                                <span className="detail-label">Warehouse Long</span>
                                <span className="detail-value">{result.nearestWarehouse?.warehouseLocation?.long}</span>
                            </div>
                            <div className="result-detail">
                                <span className="detail-label">Speed</span>
                                <span className="detail-value" style={{ textTransform: "capitalize" }}>{deliverySpeed}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CombinedCalculator;
