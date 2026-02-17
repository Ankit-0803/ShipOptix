import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Calculator from "./pages/Calculator.jsx";
import Entities from "./pages/Entities.jsx";

/**
 * Main App Component
 * Provides client-side routing via state-based page switching.
 */
function App() {
    const [page, setPage] = useState("home");

    const renderPage = () => {
        switch (page) {
            case "home":
                return <Home onNavigate={setPage} />;
            case "calculator":
                return <Calculator />;
            case "entities":
                return <Entities />;
            default:
                return <Home onNavigate={setPage} />;
        }
    };

    return (
        <>
            <Navbar currentPage={page} onNavigate={setPage} />
            <div className="container">
                {renderPage()}
            </div>
        </>
    );
}

export default App;
