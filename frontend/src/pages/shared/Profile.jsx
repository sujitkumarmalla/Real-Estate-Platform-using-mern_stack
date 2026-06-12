import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { HiCamera, HiPencil, HiCheck, HiX, HiUser, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Profile = () => {
    const { user, token, refreshUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || ''
            });
            setPreview(user.profilePic);
        }
    }, [user]);

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
        setLoading(true);
        setMessage({ type: '', text: '' });

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (profilePic) data.append('profilePic', profilePic);

        try {
            await axios.put(`${API_URL.replace(/\/$/, '')}/api/user/profile`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            await refreshUser();
            setEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Failed to update profile", error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-bg-alt min-h-screen flex flex-col">
            <Navbar />
            <main className="container flex-1 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="card-premium p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                            <div className="relative group">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary-light overflow-hidden shadow-xl">
                                    <img 
                                        src={preview || `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {editing && (
                                    <label className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-primary-dark transition-colors">
                                        <HiCamera size={20} />
                                        <input type="file" name="profilePic" className="hidden" accept="image/*" onChange={handleChange} />
                                    </label>
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                                    <h1 className="text-3xl font-extrabold text-text-main">{user.name}</h1>
                                    <span className="px-3 py-1 bg-primary-light text-primary text-xs font-bold rounded-full uppercase self-center md:self-auto">
                                        {user.role} Account
                                    </span>
                                </div>
                                <p className="text-text-muted mb-6">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                                
                                {!editing && (
                                    <button 
                                        onClick={() => setEditing(true)}
                                        className="btn btn-outline flex items-center gap-2 mx-auto md:mx-0"
                                    >
                                        <HiPencil /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl mb-8 text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <HiUser className="text-primary" /> Full Name
                                    </label>
                                    {editing ? (
                                        <input 
                                            type="text" 
                                            name="name"
                                            className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary transition-all"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold p-3 bg-bg-alt rounded-xl border border-transparent">{user.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <HiMail className="text-primary" /> Email Address
                                    </label>
                                    <p className="text-lg font-semibold p-3 bg-bg-alt/50 rounded-xl border border-border text-text-muted cursor-not-allowed">
                                        {user.email}
                                    </p>
                                    <p className="text-[10px] mt-1 text-text-muted">* Email cannot be changed</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <HiPhone className="text-primary" /> Phone Number
                                    </label>
                                    {editing ? (
                                        <input 
                                            type="text" 
                                            name="phone"
                                            className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary transition-all"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Not provided"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold p-3 bg-bg-alt rounded-xl border border-transparent">
                                            {user.phone || 'Not provided'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <HiLocationMarker className="text-primary" /> Address
                                    </label>
                                    {editing ? (
                                        <input 
                                            type="text" 
                                            name="address"
                                            className="w-full p-3 rounded-xl border border-border outline-none focus:border-primary transition-all"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Not provided"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold p-3 bg-bg-alt rounded-xl border border-transparent">
                                            {user.address || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {editing && (
                                <div className="flex gap-4 mt-12">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : <><HiCheck /> Save Changes</>}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setEditing(false);
                                            setPreview(user.profilePic);
                                        }}
                                        className="btn btn-outline px-8 flex items-center gap-2"
                                    >
                                        <HiX /> Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
