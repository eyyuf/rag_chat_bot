import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">
                    Ethiopia<span>Travel</span>
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    {user && isAdmin && <li><Link to="/admin">Admin</Link></li>}
                    {user ? (
                        <li>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </li>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Signup</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
