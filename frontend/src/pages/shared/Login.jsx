import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Invalid email or password');
        }
    };

    return (
        <div className={s.pageContainer}>
            <Navbar />
            <div className={s.containerCenter}>
                <div className={s.card}>
                    <h2 className={s.title}>Welcome Back</h2>
                    <p className={s.subtitle}>Login to manage your real estate journey</p>

                    {error && <div className={s.errorAlert}>{error}</div>}

                    <form onSubmit={handleSubmit} className={s.form}>
                        <div>
                            <label className={s.label}>Email Address</label>
                            <input
                                type="email"
                                className={s.input}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className={s.passwordHeader}>
                                <label className={s.label}>Password</label>
                                <Link to="/forgot-password" className={s.forgotLink}>Forgot Password?</Link>
                            </div>
                            <input
                                type="password"
                                className={s.input}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className={s.submitButton} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className={s.footerText}>
                        Don't have an account? <Link to="/register" className={s.registerLink}>Register Now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
