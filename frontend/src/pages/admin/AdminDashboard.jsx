import React, { useEffect, useState } from 'react';
import { adminDashboardStyles as s, adminLayoutStyles as ls } from '../../assets/dummyStyles';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { HiUsers, HiHome, HiChatAlt2, HiRefresh } from 'react-icons/hi';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token } = useAuth();

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
                                <button className={s.adminToolButton}>Generate System Report</button>
                                <button className={s.adminToolButton}>Clear Global Cache</button>
                                <button className={s.adminToolButton}>Manage Site Settings</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
