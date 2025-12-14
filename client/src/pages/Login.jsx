import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, Lock, Mail, User } from 'lucide-react';
import './Auth.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = await login(username, password);
            toast.success('Login successful!');

            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <Shield className="auth-icon" size={48} />
                    <h1>LLM Cyber Range</h1>
                    <p className="text-secondary">Practice OWASP Top 10 LLM Vulnerabilities</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label className="input-label">
                            <User size={16} /> Username
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <Lock size={16} /> Password
                        </label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="text-secondary">
                        Don't have an account? <Link to="/register" className="auth-link">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
