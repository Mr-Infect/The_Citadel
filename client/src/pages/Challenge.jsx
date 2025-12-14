import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Send, Flag, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import './Challenge.css';

export default function Challenge() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [flag, setFlag] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showFlagPanel, setShowFlagPanel] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchChallenge();
        fetchChatHistory();
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChallenge = async () => {
        try {
            const response = await api.get(`/user/challenges/${id}`);
            setChallenge(response.data.challenge);
        } catch (error) {
            toast.error('Failed to load challenge');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchChatHistory = async () => {
        try {
            const response = await api.get(`/chat/history/${id}`);
            const history = response.data.history.map(h => [
                { role: 'user', content: h.message },
                { role: 'assistant', content: h.response, isVulnerable: h.isVulnerable }
            ]).flat();
            setMessages(history);
        } catch (error) {
            console.error('Failed to load chat history');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        const userMessage = input.trim();
        setInput('');
        setSending(true);

        // Add user message to UI
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        try {
            const response = await api.post('/chat/message', {
                challengeId: id,
                message: userMessage
            });

            // Add assistant response
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.response,
                isVulnerable: response.data.isVulnerable,
                hint: response.data.hint
            }]);

            if (response.data.isVulnerable) {
                toast.success('🎯 Vulnerability exploited! Look for the flag in the response.');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send message');
            // Remove user message on error
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setSending(false);
        }
    };

    const handleSubmitFlag = async (e) => {
        e.preventDefault();
        if (!flag.trim() || submitting) return;

        setSubmitting(true);

        try {
            const response = await api.post('/user/submit-flag', {
                challengeId: id,
                flag: flag.trim()
            });

            if (response.data.success) {
                toast.success(`🎉 ${response.data.message}\n+${response.data.points} points!`, {
                    duration: 5000
                });
                setFlag('');
                setShowFlagPanel(false);
                // Refresh challenge to update status
                fetchChallenge();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit flag');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const isCompleted = challenge?.userProgress?.status === 'completed';

    return (
        <div className="challenge-page">
            <div className="challenge-container">
                <div className="challenge-sidebar glass-card">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary mb-3">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>

                    <div className="challenge-info">
                        <div className="challenge-category-badge" style={{ borderColor: 'var(--accent-cyan)' }}>
                            {challenge?.category}
                        </div>
                        <h2>{challenge?.name}</h2>
                        <p className="text-secondary">{challenge?.description}</p>

                        <div className="challenge-meta">
                            <div className="meta-item">
                                <span className="text-muted">Points:</span>
                                <strong>{challenge?.points}</strong>
                            </div>
                            <div className="meta-item">
                                <span className="text-muted">Attempts:</span>
                                <strong>{challenge?.userProgress?.attempts || 0}</strong>
                            </div>
                            <div className="meta-item">
                                <span className="text-muted">Status:</span>
                                {isCompleted ? (
                                    <span className="badge badge-success">Completed</span>
                                ) : (
                                    <span className="badge badge-warning">In Progress</span>
                                )}
                            </div>
                        </div>

                        {challenge?.hints && challenge.hints.length > 0 && (
                            <div className="hints-section">
                                <h4><Lightbulb size={18} /> Hints</h4>
                                <ul>
                                    {challenge.hints.map((hint, idx) => (
                                        <li key={idx} className="text-secondary">{hint}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFlagPanel(!showFlagPanel)}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        <Flag size={18} /> Submit Flag
                    </button>

                    {showFlagPanel && (
                        <form onSubmit={handleSubmitFlag} className="flag-form">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="input-field"
                                    value={flag}
                                    onChange={(e) => setFlag(e.target.value)}
                                    placeholder="Enter the flag..."
                                    disabled={isCompleted}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={submitting || isCompleted}
                                style={{ width: '100%' }}
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="chat-container glass-card">
                    <div className="chat-header">
                        <h3>LLM Chat Interface</h3>
                        <p className="text-secondary">Interact with the AI to find vulnerabilities</p>
                    </div>

                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="empty-chat">
                                <AlertCircle size={48} className="text-muted" />
                                <p className="text-secondary">Start a conversation to exploit the vulnerability</p>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="message-content">
                                    {msg.content}
                                    {msg.isVulnerable && (
                                        <div className="vulnerability-indicator">
                                            <CheckCircle size={16} />
                                            <span>Vulnerability Exploited!</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="chat-input-form">
                        <input
                            type="text"
                            className="chat-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={sending || isCompleted}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={sending || !input.trim() || isCompleted}
                        >
                            {sending ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : <Send size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
