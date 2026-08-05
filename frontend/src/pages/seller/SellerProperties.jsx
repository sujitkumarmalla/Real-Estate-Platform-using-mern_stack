import React, { useEffect, useState } from 'react';
import { sellerLayoutStyles as ls, adminDashboardStyles as ds } from '../../assets/dummyStyles';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { HiPlus, HiTrash, HiPencilAlt, HiCheckCircle, HiClock } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const SellerProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token } = useAuth();

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/property/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(res.data.properties || []);
        } catch (error) {
            console.error("Failed to fetch seller properties", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        try {
            await axios.delete(`${API_URL.replace(/\/$/, '')}/api/property/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(prev => prev.filter(p => p._id !== id));
        } catch (error) {
            console.error("Failed to delete property", error);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'sale' ? 'sold' : 'sale';
        try {
            await axios.patch(`${API_URL.replace(/\/$/, '')}/api/property/${id}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProperties(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className={ls.container}>
            <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={ls.contentWrapper}>
                <main className={ls.main}>
                    <SellerHeader setSidebarOpen={setSidebarOpen} title="My Properties" subtitle="Manage your listings and status">
                        <Link to="/seller/add-property" className="btn btn-primary flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold font-sans">
                            <HiPlus /> Add Property
                        </Link>
                    </SellerHeader>

                    <div className="grid grid-cols-1 gap-6">
                        {properties.length > 0 ? (
                            properties.map(p => (
                                <div key={p._id} className="card-premium p-6 flex flex-col md:flex-row gap-6 items-center">
                                    <img 
                                        src={p.images?.[0] || 'https://via.placeholder.com/150'} 
                                        alt={p.title} 
                                        className="w-full md:w-40 h-32 object-cover rounded-xl"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold">{p.title}</h3>
                                            <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${p.status === 'sale' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {p.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-muted mb-4">{p.city}, {p.area}</p>
                                        <div className="flex gap-6 text-sm font-semibold">
                                            <span>{p.bhk} BHK</span>
                                            <span>{p.bathrooms} Baths</span>
                                            <span>{p.areaSize} Sq.Ft</span>
                                        </div>
                                    </div>
                                    <div className="flex md:flex-col gap-2 w-full md:w-auto">
                                        <button 
                                            onClick={() => toggleStatus(p._id, p.status)}
                                            className="flex-1 btn btn-outline py-2 text-xs flex items-center justify-center gap-2"
                                        >
                                            {p.status === 'sale' ? <HiCheckCircle className="text-green-600" /> : <HiClock className="text-blue-600" />}
                                            Mark as {p.status === 'sale' ? 'Sold' : 'Available'}
                                        </button>
                                        <div className="flex gap-2 flex-1">
                                            <Link to={`/seller/edit-property/${p._id}`} className="flex-1 btn btn-outline py-2 text-xs flex items-center justify-center">
                                                <HiPencilAlt />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(p._id)}
                                                className="flex-1 btn btn-outline border-red-200 text-red-600 hover:bg-red-50 py-2 text-xs flex items-center justify-center"
                                            >
                                                <HiTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center text-text-muted bg-white rounded-3xl border border-border">
                                <p>You haven't listed any properties yet.</p>
                                <Link to="/seller/add-property" className="text-primary font-bold mt-4 inline-block hover:underline">
                                    Create your first listing
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SellerProperties;
