import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

/**
 * Entities Page
 * Lists all customers, sellers, products, and warehouses in tables.
 */
function Entities() {
    const [customers, setCustomers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${API_BASE_URL}/api/v1/customers`).then((r) => r.json()),
            fetch(`${API_BASE_URL}/api/v1/sellers`).then((r) => r.json()),
            fetch(`${API_BASE_URL}/api/v1/products`).then((r) => r.json()),
            fetch(`${API_BASE_URL}/api/v1/warehouses`).then((r) => r.json()),
        ])
            .then(([c, s, p, w]) => {
                setCustomers(c);
                setSellers(s);
                setProducts(p);
                setWarehouses(w);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="entities-page" style={{ textAlign: "center", padding: "4rem" }}>
                <span className="loading-spinner" style={{ width: 32, height: 32 }} />
                <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Loading entities...</p>
            </div>
        );
    }

    return (
        <div className="entities-page">
            <h1>Database Entities</h1>

            {/* Customers */}
            <div className="entity-section">
                <h2>🏪 Customers ({customers.length})</h2>
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Lat</th>
                                <th>Lng</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c) => (
                                <tr key={c.id}>
                                    <td><code>{c.id}</code></td>
                                    <td>{c.name}</td>
                                    <td>{c.phone}</td>
                                    <td>{c.city}</td>
                                    <td>{c.latitude}</td>
                                    <td>{c.longitude}</td>
                                    <td><span className="badge badge-active">{c.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sellers */}
            <div className="entity-section">
                <h2>🏭 Sellers ({sellers.length})</h2>
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>City</th>
                                <th>Lat</th>
                                <th>Lng</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.name}</td>
                                    <td>{s.contactPerson}</td>
                                    <td>{s.city}</td>
                                    <td>{s.latitude}</td>
                                    <td>{s.longitude}</td>
                                    <td><span className="badge badge-active">{s.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Products */}
            <div className="entity-section">
                <h2>📦 Products ({products.length})</h2>
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Seller</th>
                                <th>Price (₹)</th>
                                <th>Weight (kg)</th>
                                <th>Dimensions (cm)</th>
                                <th>Category</th>
                                <th>SKU</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.name}</td>
                                    <td>{p.sellerName || `Seller #${p.sellerId}`}</td>
                                    <td>₹{p.price}</td>
                                    <td>{p.weightKg}</td>
                                    <td>{p.lengthCm}×{p.widthCm}×{p.heightCm}</td>
                                    <td>{p.category}</td>
                                    <td><code>{p.sku}</code></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Warehouses */}
            <div className="entity-section">
                <h2>🏢 Warehouses ({warehouses.length})</h2>
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>City</th>
                                <th>Lat</th>
                                <th>Lng</th>
                                <th>Capacity (sqft)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {warehouses.map((w) => (
                                <tr key={w.id}>
                                    <td><code>{w.id}</code></td>
                                    <td>{w.name}</td>
                                    <td>{w.city}</td>
                                    <td>{w.latitude}</td>
                                    <td>{w.longitude}</td>
                                    <td>{w.capacitySqft?.toLocaleString() || "—"}</td>
                                    <td><span className="badge badge-active">{w.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Entities;
