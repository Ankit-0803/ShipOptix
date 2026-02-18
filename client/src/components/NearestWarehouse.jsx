import { useState } from "react";
import { API_BASE_URL } from "../config";

/**
 * Nearest Warehouse Form
 * GET /api/v1/warehouse/nearest?sellerId=X&productId=Y
 */
function NearestWarehouse({ sellers, products }) {
    const [sellerId, setSellerId] = useState("");
    const [productId, setProductId] = useState("");
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
            const res = await fetch(
                `${API_BASE_URL}/api/v1/warehouse/nearest?sellerId=${sellerId}&productId=${productId}`
            );
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to find nearest warehouse");
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
                <div className="card-header-icon" style={{ background: "rgba(99,102,241,0.15)" }}>📍</div>
                <div>
                    <h2>Find Nearest Warehouse</h2>
                    <p>Finds the closest warehouse to the seller's location</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Seller</label>
                        <select value={sellerId} onChange={(e) => { setSellerId(e.target.value); setProductId(""); }} required>
                            <option value="">Select a seller...</option>
                            {sellers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.city})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Product</label>
                        <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
                            <option value="">Select a product...</option>
                            {filteredProducts.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} — ₹{p.price}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <span className="loading-spinner" /> : "🔍"} Find Nearest
                </button>
            </form>

            {error && <div className="error-msg">⚠️ {error}</div>}

            {result && (
                <div className="result-container">
                    <div className="result-card">
                        <div className="charge-label">Nearest Warehouse</div>
                        <div className="charge-value">{result.warehouseId}</div>
                        <div className="result-details">
                            <div className="result-detail">
                                <span className="detail-label">Latitude</span>
                                <span className="detail-value">{result.warehouseLocation?.lat}</span>
                            </div>
                            <div className="result-detail">
                                <span className="detail-label">Longitude</span>
                                <span className="detail-value">{result.warehouseLocation?.long}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NearestWarehouse;
