import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass-morphism">
            <div className="container">
                <Link to="/" className="logo">
                    <Bot size={32} />
                    <span>Voyager AI</span>
                </Link>

                <div className="nav-links">
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-item">
                                    <LayoutDashboard size={18} />
                                    <span>Admin</span>
                                </Link>
                            )}
                            <div className="user-profile">
                                <User size={18} />
                                <span>{user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="logout-btn">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-item">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>

            <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          height: 70px;
          display: flex;
          align-items: center;
        }
        .navbar .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
        }
        .logo svg { color: var(--primary); }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-item {
          text-decoration: none;
          color: var(--text-muted);
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }
        .nav-item:hover { color: white; }
        .logout-btn {
          background: none;
          color: var(--text-muted);
        }
        .logout-btn:hover { color: var(--error); }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
