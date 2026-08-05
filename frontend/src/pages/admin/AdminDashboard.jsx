import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminDashboardStyles as s, adminLayoutStyles as ls } from '../../assets/dummyStyles';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { HiUsers, HiHome, HiChatAlt2, HiRefresh, HiUserAdd, HiCheckCircle, HiChat } from 'react-icons/hi';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data.stats);
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <div className={s.loaderFullPage}><div className={s.loader}></div></div>;

    return (
        <div className={ls.layout}>
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={ls.mainWrapper}>
                <main className={ls.mainContent}>
                    <div className={s.headerContainer}>
                        <div>
                            <h1 className={s.pageTitle}>Admin Dashboard</h1>
                            <p className={s.pageSubtitle}>System overview and analytics</p>
                        </div>
                        <button onClick={fetchStats} className={s.refreshButton}>
                            <HiRefresh size={18} className="mr-2" /> Refresh
                        </button>
                    </div>

                    <div className={s.statsGrid}>
                        <div className={s.statCard}>
                            <div className={`${s.statIconContainer} bg-blue-100 text-blue-600`}>
                                <HiUsers size={24} />
                            </div>
                            <div>
                                <p className={s.statTitle}>Total Users</p>
                                <p className={s.statValue}>{stats?.totalUsers || 0}</p>
                            </div>
                        </div>
                        <div className={s.statCard}>
                            <div className={`${s.statIconContainer} bg-green-100 text-green-600`}>
                                <HiHome size={24} />
                            </div>
                            <div>
                                <p className={s.statTitle}>Total Properties</p>
                                <p className={s.statValue}>{stats?.totalProperties || 0}</p>
                            </div>
                        </div>
                        <div className={s.statCard}>
                            <div className={`${s.statIconContainer} bg-purple-100 text-purple-600`}>
                                <HiChatAlt2 size={24} />
                            </div>
                            <div>
                                <p className={s.statTitle}>Total Inquiries</p>
                                <p className={s.statValue}>{stats?.totalInquiries || 0}</p>
                            </div>
                        </div>
                        <div className={s.statCard}>
                            <div className={`${s.statIconContainer} bg-amber-100 text-amber-600`}>
                                <HiUserAdd size={24} />
                            </div>
                            <div>
                                <p className={s.statTitle}>Pending Sellers</p>
                                <p className={s.statValue}>{stats?.pendingSellers || 0}</p>
                            </div>
                        </div>
                        <div className={s.statCard}>
                            <div className={`${s.statIconContainer} bg-teal-100 text-teal-600`}>
                                <HiCheckCircle size={24} />
                            </div>
                            <div>
                                <p className={s.statTitle}>Active Listings</p>
                                <p className={s.statValue}>{stats?.activeListing || 0}</p>
                            </div>
                        </div>
                        <div className={s.statCard}>
                            <div className={`${s.statIconContainer} bg-rose-100 text-rose-600`}>
                                <HiHome size={24} />
                            </div>
                            <div>
                                <p className={s.statTitle}>Sold Properties</p>
                                <p className={s.statValue}>{stats?.soldProperties || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className={s.secondGrid}>
                        <div className={s.systemHealthCard}>
                            <h2 className={s.systemHealthTitle}>System Health</h2>
                            <div className={s.servicesContainer}>
                                <div className={s.serviceItem}>
                                    <span className={s.serviceName}>Database</span>
                                    <div className={s.statusContainer}>
                                        <div className={s.statusDot}></div>
                                        <span className={s.statusText}>Healthy</span>
                                    </div>
                                </div>
                                <div className={s.serviceItem}>
                                    <span className={s.serviceName}>API Server</span>
                                    <div className={s.statusContainer}>
                                        <div className={s.statusDot}></div>
                                        <span className={s.statusText}>Online</span>
                                    </div>
                                </div>
                                <div className={s.serviceItem}>
                                    <span className={s.serviceName}>Storage (Cloudinary)</span>
                                    <div className={s.statusContainer}>
                                        <div className={s.statusDot}></div>
                                        <span className={s.statusText}>Connected</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={s.adminToolsCard}>
                            <h2 className={s.adminToolsTitle}>Quick Actions</h2>
                            <p className={s.adminToolsDesc}>Common administrative tasks at your fingertips.</p>
                            <div className={s.adminToolsButtonsContainer}>
                                <button onClick={() => navigate('/admin/seller-requests')} className={s.adminToolButton}>Approve Seller Requests</button>
                                <button onClick={() => navigate('/admin/chats')} className={s.adminToolButton}>Monitor Live Conversations</button>
                                <button onClick={() => navigate('/admin/users')} className={s.adminToolButton}>Manage Platform Users</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
