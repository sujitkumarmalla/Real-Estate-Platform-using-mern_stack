import React, { useEffect, useState } from 'react';
import { adminDashboardStyles as s, adminLayoutStyles as ls } from '../../assets/dummyStyles';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { HiTrash, HiExternalLink, HiHome } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const AdminPropertyManagement = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token } = useAuth();

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/admin/properties`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(res.data.properties || []);
        } catch (error) {
            console.error("Failed to fetch properties", error);
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
            await axios.delete(`${API_URL.replace(/\/$/, '')}/api/admin/properties/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(prev => prev.filter(p => p._id !== id));
        } catch (error) {
            console.error("Failed to delete property", error);
        }
    };

    if (loading) return <div className={s.loaderFullPage}><div className={s.loader}></div></div>;

    return (
        <div className={ls.layout}>
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={ls.mainWrapper}>
                <main className={ls.mainContent}>
                    <div className={s.headerContainer}>
                        <div>
                            <h1 className={s.pageTitle}>Property Management</h1>
                            <p className={s.pageSubtitle}>Monitor all listings across the platform</p>
                        </div>
                    </div>

                    <div className="card-premium overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg-alt text-text-muted text-[10px] uppercase font-bold tracking-widest">
                                        <th className="p-6">Property</th>
                                        <th className="p-6">Seller</th>
                                        <th className="p-6">Price</th>
                                        <th className="p-6">Status</th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {properties.map(p => (
                                        <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <img src={p.images?.[0] || 'https://via.placeholder.com/50'} className="w-12 h-10 object-cover rounded-lg" />
                                                    <div>
                                                        <p className="font-bold text-text-main">{p.title}</p>
                                                        <p className="text-xs text-text-muted">{p.city}, {p.area}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <p className="text-sm font-semibold">{p.seller?.name || 'Unknown'}</p>
                                                <p className="text-xs text-text-muted">{p.seller?.email || ''}</p>
                                            </td>
                                            <td className="p-6 font-bold text-primary text-sm">
                                                ${p.price?.toLocaleString()}
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'sale' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link 
                                                        to={`/property/${p._id}`}
                                                        className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100"
                                                        title="View Details"
                                                    >
                                                        <HiExternalLink size={18} />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(p._id)}
                                                        className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100"
                                                        title="Delete"
                                                    >
                                                        <HiTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPropertyManagement;
