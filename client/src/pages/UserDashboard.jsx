import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Shield, LogOut, Target, Trophy, TrendingUp, Lock, CheckCircle, Circle } from 'lucide-react';
import './UserDashboard.css';

export default function UserDashboard() {
    const [challenges, setChallenges] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchChallenges();
        fetchProgress();
    }, []);

    const fetchChallenges = async () => {
        try {
            const response = await api.get('/user/challenges');
            setChallenges(response.data.challenges);
        } catch (error) {
            toast.error('Failed to fetch challenges');
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        try {
            const response = await api.get('/user/progress');
            setProgress(response.data);
        } catch (error) {
            toast.error('Failed to fetch progress');
        }
    };

    const handleChallengeClick = (challengeId) => {
        navigate(`/challenge/${challengeId}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDifficultyChange = async (e) => {
        const newDifficulty = e.target.value;

        try {
            const response = await api.patch('/user/difficulty', {
                difficulty: newDifficulty
            });

            toast.success(`Difficulty changed to ${newDifficulty.toUpperCase()}!`);

            // Update user in localStorage
            const updatedUser = { ...user, difficulty: newDifficulty };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Refresh challenges and progress for new difficulty
            setLoading(true);
            await fetchChallenges();
            await fetchProgress();
            setLoading(false);

            // Force page reload to update user context
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to change difficulty');
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'LLM01': 'var(--accent-cyan)',
            'LLM02': 'var(--accent-purple)',
            'LLM03': 'var(--accent-green)',
            'LLM04': 'var(--accent-yellow)',
            'LLM05': 'var(--accent-red)',
            'LLM06': 'var(--accent-cyan)',
            'LLM07': 'var(--accent-purple)',
            'LLM08': 'var(--accent-green)',
            'LLM09': 'var(--accent-yellow)',
            'LLM10': 'var(--accent-red)',
        };
        return colors[category] || 'var(--accent-cyan)';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="user-dashboard">
            <header className="dashboard-header glass-card">
                <div className="header-content">
                    <div className="header-left">
                        <Shield size={32} className="header-icon" />
                        <div>
                            <h1>Cyber Range</h1>
                            <p className="text-secondary">Welcome, {user?.username}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="progress-section">
                    <div className="stats-grid">
                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'var(--gradient-cyber)' }}>
                                <Target size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>{progress?.stats?.totalChallenges || 0}</h3>
                                <p className="text-secondary">Total Challenges</p>
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}>
                                <CheckCircle size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>{progress?.stats?.completed || 0}</h3>
                                <p className="text-secondary">Completed</p>
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>{progress?.stats?.completionRate || 0}%</h3>
                                <p className="text-secondary">Completion Rate</p>
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'var(--gradient-danger)' }}>
                                <Trophy size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>{progress?.stats?.totalScore || 0}</h3>
                                <p className="text-secondary">Total Points</p>
                            </div>
                        </div>
                    </div>

                    <div className="difficulty-selector glass-card">
                        <h3>Difficulty Level</h3>
                        <p className="text-secondary mb-2" style={{ fontSize: '0.875rem' }}>
                            Change your difficulty to access different challenges
                        </p>
                        <select
                            className="select-field"
                            value={user?.difficulty || 'practitioner'}
                            onChange={handleDifficultyChange}
                            style={{ marginTop: 'var(--spacing-md)' }}
                        >
                            <option value="practitioner">Practitioner - Beginner (100 pts/challenge)</option>
                            <option value="expert">Expert - Intermediate (200 pts/challenge)</option>
                            <option value="enterprise">Enterprise - Advanced (300 pts/challenge)</option>
                        </select>
                        <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
                            <span className={`badge badge-${user?.difficulty === 'practitioner' ? 'info' : user?.difficulty === 'expert' ? 'warning' : 'danger'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                                Current: {user?.difficulty?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="challenges-section">
                    <h2>Available Challenges</h2>
                    <p className="text-secondary mb-3">Select a challenge to start practicing LLM pentesting</p>

                    <div className="challenges-grid">
                        {challenges.map((challenge) => {
                            const userProgress = challenge.userProgress;
                            const isCompleted = userProgress?.status === 'completed';
                            const isInProgress = userProgress?.status === 'in_progress';

                            return (
                                <div
                                    key={challenge.id}
                                    className={`challenge-card glass-card ${isCompleted ? 'completed' : ''}`}
                                    onClick={() => handleChallengeClick(challenge.id)}
                                >
                                    <div className="challenge-header">
                                        <div className="challenge-category" style={{ borderColor: getCategoryColor(challenge.category) }}>
                                            {challenge.category}
                                        </div>
                                        {isCompleted && <CheckCircle size={20} className="completed-icon" />}
                                        {isInProgress && !isCompleted && <Circle size={20} className="in-progress-icon" />}
                                    </div>

                                    <h3>{challenge.name}</h3>
                                    <p className="text-secondary">{challenge.description}</p>

                                    <div className="challenge-footer">
                                        <div className="challenge-points">
                                            <Trophy size={16} />
                                            <span>{challenge.points} pts</span>
                                        </div>
                                        {userProgress && (
                                            <div className="challenge-attempts text-muted">
                                                Attempts: {userProgress.attempts}
                                            </div>
                                        )}
                                    </div>

                                    {isCompleted && (
                                        <div className="completed-overlay">
                                            <CheckCircle size={48} />
                                            <span>Completed!</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {challenges.length === 0 && (
                        <div className="empty-state glass-card">
                            <Lock size={48} className="text-muted" />
                            <h3>No Challenges Available</h3>
                            <p className="text-secondary">Contact your administrator to upload challenges for your difficulty level.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
