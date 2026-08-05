import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerLayoutStyles as ls, adminDashboardStyles as ds, sellerDashboardStyles as ss } from '../../assets/dummyStyles';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { HiHome, HiChatAlt2, HiEye, HiCheckCircle } from 'react-icons/hi';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token, user } = useAuth();

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [statsRes, inqRes] = await Promise.all([
                axios.get(`${API_URL.replace(/\/$/, '')}/api/property/seller/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL.replace(/\/$/, '')}/api/inquiry/seller`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setStats(statsRes.data.stats);
            setInquiries(inqRes.data.inquiries || []);
        } catch (error) {
            console.error("Failed to fetch seller dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchStats();
    }, [token]);

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className={ls.container}>
            <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={ls.contentWrapper}>
                <main className={ls.main}>
                    <SellerHeader setSidebarOpen={setSidebarOpen} title="Seller Overview" subtitle="Track your property performance" />

                    <div className={ds.statsGrid}>
                        <div className={ds.statCard}>
                            <div className="w-11 h-11 rounded-[0.875rem] flex items-center justify-center bg-blue-100 text-blue-600">
                                <HiHome size={24} />
                            </div>
                            <div>
                                <p className={ds.statTitle}>Total Properties</p>
                                <p className={ds.statValue}>{stats?.totalproperties || 0}</p>
                            </div>
                        </div>
                        <div className={ds.statCard}>
                            <div className="w-11 h-11 rounded-[0.875rem] flex items-center justify-center bg-green-100 text-green-600">
                                <HiCheckCircle size={24} />
                            </div>
                            <div>
                                <p className={ds.statTitle}>Active Listings</p>
                                <p className={ds.statValue}>{stats?.activeListings || 0}</p>
                            </div>
                        </div>
                        <div className={ds.statCard}>
                            <div className="w-11 h-11 rounded-[0.875rem] flex items-center justify-center bg-purple-100 text-purple-600">
                                <HiChatAlt2 size={24} />
                            </div>
                            <div>
                                <p className={ds.statTitle}>Total Inquiries</p>
                                <p className={ds.statValue}>{stats?.totalInquiries || 0}</p>
                            </div>
                        </div>
                        <div className={ds.statCard}>
                            <div className="w-11 h-11 rounded-[0.875rem] flex items-center justify-center bg-orange-100 text-orange-600">
                                <HiEye size={24} />
                            </div>
                            <div>
                                <p className={ds.statTitle}>Total Views</p>
                                <p className={ds.statValue}>{stats?.totalViews || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="card-premium p-6">
                            <h2 className="text-xl font-bold mb-4">Performance Insights</h2>
                            <p className="text-text-muted mb-6 text-sm">Your properties have seen a 15% increase in traffic this week. Keep your listings updated for better visibility.</p>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center p-3 bg-bg-alt rounded-xl">
                                    <span className="text-sm font-medium">Profile Completeness</span>
                                    <span className="text-sm font-bold text-primary">85%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-bg-alt rounded-xl">
                                    <span className="text-sm font-medium">Avg. Response Time</span>
                                    <span className="text-sm font-bold text-primary">2.4 hours</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Inquiries Widget */}
                        <div className={ss.inquiriesWidget}>
                            <h2 className={ss.widgetTitle}>Recent Inquiries</h2>
                            <p className={ss.widgetSubtitle}>Latest inquiries received on your listings</p>
                            <div className={ss.inquiriesList}>
                                {inquiries.length > 0 ? (
                                    inquiries.slice(0, 5).map(inq => (
                                        <div key={inq._id} className={ss.inquiryItem}>
                                            <div className={ss.inquiryLeft}>
                                                <div className={ss.inquiryIcon}>
                                                    <HiChatAlt2 className="text-primary" size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <p className={ss.inquiryName}>{inq.buyer?.name || 'Buyer'}</p>
                                                    <p className={ss.inquiryProperty}>{inq.property?.title || 'Property'}</p>
                                                </div>
                                            </div>
                                            <div className={ss.inquiryRight}>
                                                <p className={ss.inquiryDate}>
                                                    {new Date(inq.createdAt).toLocaleDateString()}
                                                </p>
                                                <span className={ss.inquiryStatus(inq.isRead ? 'read' : 'unread')}>
                                                    {inq.isRead ? 'read' : 'new'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={ss.noInquiries}>No inquiries received yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Upgrade credits section */}
                    <div className="card-premium p-8 bg-primary text-white flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-left">
                            <h2 className="text-2xl font-black mb-2">Messaging Credits Balance</h2>
                            <p className="text-sm opacity-90 mb-4 md:mb-0">
                                You currently have <span className="font-bold underline">{user?.credits ?? 100} credits</span> left. Each sent message consumes 1 credit. Upgrade now to keep communicating with buyers!
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate('/upgrade')}
                            className="btn bg-white text-primary font-extrabold px-8 py-3.5 hover:bg-teal-50 transition-colors shrink-0"
                        >
                            Upgrade Now
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SellerDashboard;
