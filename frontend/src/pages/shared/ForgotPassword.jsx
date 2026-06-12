import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import Navbar from '../../components/common/Navbar';
import { forgotPasswordStyles as s } from '../../assets/dummyStyles';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL.replace(/\/$/, '')}/api/auth/forgot-password`, { email });
            if (res.data.success) {
                setSuccess('Password reset link sent to your email!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.container}>
            <Navbar />
            <div className={s.centerWrapper}>
                <div className={s.formCard}>
                    <h2 className={s.title}>Forgot Password</h2>
                    <p className={s.subtitle}>Enter your email to receive a reset link</p>

                    {error && <div className={s.errorMessage}>{error}</div>}
                    {success && <div className={s.successMessage}>{success}</div>}

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
                        <button type="submit" className={s.submitButton} disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <p className={s.footerText}>
                        Remember your password? <Link to="/login" className={s.link}>Login Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
