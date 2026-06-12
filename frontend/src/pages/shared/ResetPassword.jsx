import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import Navbar from '../../components/common/Navbar';
import { resetPasswordStyles as s } from '../../assets/dummyStyles';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL.replace(/\/$/, '')}/api/auth/reset-password/${token}`, { password });
            if (res.data.success) {
                setSuccess('Password reset successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.container}>
            <Navbar />
            <div className={s.centerWrapper}>
                <div className={s.formCard}>
                    <h2 className={s.title}>Reset Password</h2>
                    <p className={s.subtitle}>Create a new secure password</p>

                    {error && <div className={s.errorMessage}>{error}</div>}
                    {success && <div className={s.successMessage}>{success}</div>}

                    <form onSubmit={handleSubmit} className={s.form}>
                        <div>
                            <label className={s.label}>New Password</label>
                            <input 
                                type="password" 
                                className={s.input}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className={s.label}>Confirm Password</label>
                            <input 
                                type="password" 
                                className={s.input}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={s.submitButton} disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
