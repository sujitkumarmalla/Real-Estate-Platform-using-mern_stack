import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import Navbar from '../../components/common/Navbar';
import { verifyEmailStyles as s } from '../../assets/dummyStyles';

const VerifyEmail = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();
    const email = new URLSearchParams(location.search).get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL.replace(/\/$/, '')}/api/auth/verify-email`, {
                email,
                code
            });
            if (res.data.success) {
                setSuccess('Email verified successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.pageContainer}>
            <Navbar />
            <div className={s.containerCenter}>
                <div className={s.card}>
                    <h2 className={s.title}>Verify Email</h2>
                    <p className={s.subtitle}>Enter the 6-digit code sent to {email}</p>

                    {error && <div className={s.errorAlert}>{error}</div>}
                    {success && <div className={s.successAlert}>{success}</div>}

                    <form onSubmit={handleSubmit} className={s.form}>
                        <div>
                            <label className={s.label}>Verification Code</label>
                            <input 
                                type="text" 
                                className={s.codeInput}
                                placeholder="000000"
                                maxLength="6"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={s.submitButton} disabled={loading || !email}>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
