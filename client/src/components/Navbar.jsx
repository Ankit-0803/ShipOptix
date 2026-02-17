/**
 * Navbar Component
 * Sticky top navigation with brand logo and page links.
 */
function Navbar({ currentPage, onNavigate }) {
    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
                <div className="navbar-logo">JT</div>
                <span className="navbar-title">Shipping Estimator</span>
            </div>
            <div className="navbar-nav">
                <button
                    className={`nav-btn ${currentPage === "home" ? "active" : ""}`}
                    onClick={() => onNavigate("home")}
                >
                    Home
                </button>
                <button
                    className={`nav-btn ${currentPage === "calculator" ? "active" : ""}`}
                    onClick={() => onNavigate("calculator")}
                >
                    Calculator
                </button>
                <button
                    className={`nav-btn ${currentPage === "entities" ? "active" : ""}`}
                    onClick={() => onNavigate("entities")}
                >
                    Entities
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
