import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, verifyLoginOtp } = useAuth();
    const navigate = useNavigate();

    const handleLoginSuccess = (user) => {
        if (user?.role === 'admin') {
            navigate('/admin');
        } else if (user?.role === 'seller') {
            navigate('/seller');
        } else {
            navigate('/dashboard');
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            if (result.requiresOtp) {
                setStep(2);
            } else {
                handleLoginSuccess(result.user);
            }
        } else {
            setError(result.message || 'Invalid email or password');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await verifyLoginOtp(email, otp);
        setLoading(false);

        if (result.success) {
            handleLoginSuccess(result.user);
        } else {
            setError(result.message || 'Invalid OTP');
        }
    };

    return (
        <div className={s.pageContainer}>
            <Navbar />
            <div className={s.containerCenter}>
                <div className={s.card}>
                    <h2 className={s.title}>{step === 1 ? 'Welcome Back' : 'Verify OTP'}</h2>
                    <p className={s.subtitle}>
                        {step === 1 ? 'Login to manage your real estate journey' : 'Enter the OTP sent to your email'}
                    </p>

                    {error && <div className={s.errorAlert}>{error}</div>}

                    {step === 1 ? (
                        <form onSubmit={handleLoginSubmit} className={s.form}>
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
                    ) : (
                        <form onSubmit={handleOtpSubmit} className={s.form}>
                            <div>
                                <label className={s.label}>OTP</label>
                                <input
                                    type="text"
                                    className={s.input}
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={s.submitButton} disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>
                        </form>
                    )}

                    {step === 1 && (
                        <p className={s.footerText}>
                            Don't have an account? <Link to="/register" className={s.registerLink}>Register Now</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
