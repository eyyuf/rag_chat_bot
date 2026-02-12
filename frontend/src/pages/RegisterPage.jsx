import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page animate-fade-in">
            <div className="auth-card glass-morphism">
                <div className="auth-header">
                    <h2>Join Voyager AI</h2>
                    <p>Unlock the power of your documents with AI</p>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'} <ArrowRight size={18} />
                    </button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>

            <style jsx>{`
                .auth-page {
                    min-height: calc(100vh - 70px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .auth-card {
                    width: 100%;
                    max-width: 450px;
                    padding: 3rem;
                    border-radius: 1.5rem;
                }
                .auth-header { text-align: center; margin-bottom: 2.5rem; }
                .auth-header h2 { font-size: 1.75rem; margin-bottom: 0.5rem; }
                .auth-header p { color: var(--text-muted); font-size: 0.95rem; }

                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; }
                .input-wrapper { position: relative; }
                .input-wrapper svg {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .input-wrapper input { width: 100%; padding-left: 3rem; }

                .btn-full { width: 100%; display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem; }
                
                .auth-error {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--error);
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 0.85rem;
                    margin-bottom: 1.5rem;
                    text-align: center;
                }
                .auth-footer { text-align: center; margin-top: 2rem; color: var(--text-muted); font-size: 0.9rem; }
                .auth-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default RegisterPage;
