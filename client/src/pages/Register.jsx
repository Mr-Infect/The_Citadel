import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, Lock, Mail, User, Target } from 'lucide-react';
import './Auth.css';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        difficulty: 'practitioner'
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            await register(formData.username, formData.email, formData.password, formData.difficulty);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Registration failed';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <Shield className="auth-icon" size={48} />
                    <h1>Create Account</h1>
                    <p className="text-secondary">Join the LLM Cyber Range</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label className="input-label">
                            <User size={16} /> Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="input-field"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <Mail size={16} /> Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <Lock size={16} /> Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <Lock size={16} /> Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="input-field"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <Target size={16} /> Difficulty Level
                        </label>
                        <select
                            name="difficulty"
                            className="select-field"
                            value={formData.difficulty}
                            onChange={handleChange}
                        >
                            <option value="practitioner">Practitioner - Beginner Level</option>
                            <option value="expert">Expert - Intermediate Level</option>
                            <option value="enterprise">Enterprise - Advanced Level</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Register'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="text-secondary">
                        Already have an account? <Link to="/login" className="auth-link">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
