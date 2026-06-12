import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import { HiCamera } from 'react-icons/hi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'buyer'
    });
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'profilePic') {
            const file = e.target.files[0];
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (profilePic) data.append('profilePic', profilePic);

        const result = await register(data);
        setLoading(false);

        if (result.success) {
            navigate(`/verify-email?email=${formData.email}`);
        } else {
            setError(result.message || 'Registration failed');
        }
    };

    return (
        <div className={s.pageWrapper}>
            <Navbar />
            <div className={s.container}>
                <div className={s.formCard}>
                    <h2 className={s.heading}>Create Account</h2>
                    <p className={s.subheading}>Join our community of home seekers and sellers</p>

                    {error && <div className={s.errorMessage}>{error}</div>}

                    <form onSubmit={handleSubmit} className={s.form}>
                        <div>
                            <label className={s.label}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className={s.input}
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className={s.label}>Profile Photo (Optional)</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary-light border-2 border-primary overflow-hidden flex items-center justify-center shrink-0">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <HiCamera className="text-primary text-2xl" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    name="profilePic"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={s.label}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className={s.input}
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className={s.label}>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                className={s.input}
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className={s.label}>Password</label>
                            <input
                                type="password"
                                name="password"
                                className={s.input}
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className={s.label}>I want to</label>
                            <div className={s.roleContainer}>
                                <label 
                                    className={`${s.roleLabelBase} ${formData.role === 'buyer' ? s.roleLabelActive : s.roleLabelInactive}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="role" 
                                        value="buyer" 
                                        className={s.hiddenRadio}
                                        checked={formData.role === 'buyer'}
                                        onChange={handleChange}
                                    />
                                    Buy / Rent
                                </label>
                                <label 
                                    className={`${s.roleLabelBase} ${formData.role === 'seller' ? s.roleLabelActive : s.roleLabelInactive}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="role" 
                                        value="seller" 
                                        className={s.hiddenRadio}
                                        checked={formData.role === 'seller'}
                                        onChange={handleChange}
                                    />
                                    Sell / Lease
                                </label>
                            </div>
                        </div>

                        <button type="submit" className={s.submitButton} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <p className={s.footerText}>
                        Already have an account? <Link to="/login" className={s.loginLink}>Login Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
