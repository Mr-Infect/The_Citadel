import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Target, Upload, LogOut, Shield, TrendingUp } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data);
        } catch (error) {
            toast.error('Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            toast.error('Please upload a JSON file');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/admin/upload-vulnerabilities', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success(`Successfully created ${response.data.created} challenges!`);
            if (response.data.errors.length > 0) {
                toast.error(`${response.data.errors.length} challenges failed to upload`);
            }
            fetchStats();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const difficultyData = stats?.difficultyStats?.map(d => ({
        name: d.difficulty.charAt(0).toUpperCase() + d.difficulty.slice(1),
        value: parseInt(d.count)
    })) || [];

    const COLORS = ['#00f0ff', '#a855f7', '#f59e0b'];

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header glass-card">
                <div className="header-content">
                    <div className="header-left">
                        <Shield size={32} className="header-icon" />
                        <div>
                            <h1>Admin Dashboard</h1>
                            <p className="text-secondary">Welcome back, {user?.username}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="stats-grid">
                    <div className="stat-card glass-card">
                        <div className="stat-icon" style={{ background: 'var(--gradient-cyber)' }}>
                            <Users size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.totalUsers || 0}</h3>
                            <p className="text-secondary">Total Users</p>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.activeUsers || 0}</h3>
                            <p className="text-secondary">Active Users</p>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                            <Target size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.totalChallenges || 0}</h3>
                            <p className="text-secondary">Total Challenges</p>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon" style={{ background: 'var(--gradient-danger)' }}>
                            <Shield size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.completedChallenges || 0}</h3>
                            <p className="text-secondary">Completed</p>
                        </div>
                    </div>
                </div>

                <div className="upload-section glass-card">
                    <h2>Upload Vulnerabilities</h2>
                    <p className="text-secondary mb-3">Upload a JSON file to add new challenges to the platform</p>
                    <label className="upload-btn btn btn-primary">
                        <Upload size={20} />
                        {uploading ? 'Uploading...' : 'Choose JSON File'}
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <div className="charts-grid">
                    <div className="chart-card glass-card">
                        <h2>Difficulty Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={difficultyData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {difficultyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card glass-card">
                        <h2>User Progress Overview</h2>
                        <div className="users-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Difficulty</th>
                                        <th>Attempts</th>
                                        <th>Completed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.userProgress?.slice(0, 5).map((up, idx) => (
                                        <tr key={idx}>
                                            <td>{up.user?.username || 'N/A'}</td>
                                            <td>
                                                <span className={`badge badge-${up.user?.difficulty === 'practitioner' ? 'info' : up.user?.difficulty === 'expert' ? 'warning' : 'danger'}`}>
                                                    {up.user?.difficulty}
                                                </span>
                                            </td>
                                            <td>{up.totalAttempts}</td>
                                            <td>{up.completed}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="users-section glass-card">
                    <h2>Connected Devices</h2>
                    <div className="users-grid">
                        {users.map((u) => (
                            <div key={u.id} className="user-card glass-card">
                                <div className="user-info">
                                    <h4>{u.username}</h4>
                                    <p className="text-secondary">{u.email}</p>
                                    <span className={`badge badge-${u.difficulty === 'practitioner' ? 'info' : u.difficulty === 'expert' ? 'warning' : 'danger'}`}>
                                        {u.difficulty}
                                    </span>
                                </div>
                                <div className="user-stats">
                                    <div className="user-stat">
                                        <span className="text-muted">Progress:</span>
                                        <strong>{u.progress?.filter(p => p.status === 'completed').length || 0}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
