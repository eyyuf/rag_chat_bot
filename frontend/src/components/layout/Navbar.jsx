import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/layout.css";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    RAG Chat
                </Link>
                <div className="navbar-menu">
                    {user ? (
                        <>
                            <span className="navbar-user">
                                {user.name} ({user.role})
                            </span>
                            {user.role === "admin" && (
                                <Link to="/admin" className="navbar-link">
                                    Admin
                                </Link>
                            )}
                            <button onClick={logout} className="navbar-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">
                                Login
                            </Link>
                            <Link to="/signup" className="navbar-link">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
