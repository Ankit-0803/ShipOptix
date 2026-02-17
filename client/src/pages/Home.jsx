/**
 * Home Page
 * Hero section with feature highlights and quick navigation.
 */
function Home({ onNavigate }) {
    return (
        <div className="hero">
            <h1>
                B2B <span>Shipping Charge</span> Estimator
            </h1>
            <p>
                Calculate precise shipping costs for Kirana store deliveries across India.
                Powered by Haversine distance, smart transport selection, and real-time pricing.
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate("calculator")}>
                🚀 Open Calculator
            </button>

            <div className="hero-features" style={{ marginTop: "3rem" }}>
                <div className="feature-card">
                    <div className="feature-icon" style={{ background: "rgba(99,102,241,0.15)" }}>📍</div>
                    <h3>Nearest Warehouse</h3>
                    <p>Find the closest warehouse to any seller using Haversine distance formula.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon" style={{ background: "rgba(245,158,11,0.15)" }}>🚛</div>
                    <h3>Smart Transport</h3>
                    <p>Auto-selects Aeroplane, Truck, or Mini Van based on delivery distance.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon" style={{ background: "rgba(16,185,129,0.15)" }}>⚡</div>
                    <h3>Delivery Speed</h3>
                    <p>Choose Standard or Express delivery with transparent pricing breakdowns.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon" style={{ background: "rgba(236,72,153,0.15)" }}>🏪</div>
                    <h3>B2B Marketplace</h3>
                    <p>Built for Kirana stores — bulk pricing for rice, sugar, FMCG, and more.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
