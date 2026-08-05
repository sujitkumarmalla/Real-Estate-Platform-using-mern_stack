import React, { useEffect, useState } from 'react';
import { sellerRequestsStyles as s, adminLayoutStyles as ls } from '../../assets/dummyStyles';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { HiCheck, HiMail, HiPhone, HiCalendar, HiUser } from 'react-icons/hi';

const AdminSellerRequests = () => {
    const [pendingSellers, setPendingSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token } = useAuth();

    const fetchPendingSellers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/admin/pending-sellers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingSellers(res.data.pendingSeller || []);
        } catch (error) {
            console.error("Failed to fetch pending sellers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingSellers();
    }, []);

    const handleApprove = async (id) => {
        if (!window.confirm("Are you sure you want to approve this seller?")) return;
        try {
            await axios.patch(`${API_URL.replace(/\/$/, '')}/api/admin/approve-seller/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingSellers(prev => prev.filter(seller => seller._id !== id));
        } catch (error) {
            console.error("Failed to approve seller", error);
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
                            <h1 className={s.pageTitle}>Seller Requests</h1>
                            <p className={s.pageSubtitle}>Review and approve pending seller accounts</p>
                        </div>
                    </div>

                    <div className={s.card}>
                        <div className={s.cardInner}>
                            <h2 className={s.sectionTitle}>Pending Approvals ({pendingSellers.length})</h2>

                            {pendingSellers.length > 0 ? (
                                <div className={s.requestGrid}>
                                    {pendingSellers.map(seller => (
                                        <div key={seller._id} className={s.requestCard}>
                                            <div className={s.requestHeader}>
                                                <div className={s.avatar}>
                                                    {seller.profilePic ? (
                                                        <img src={seller.profilePic} className="w-full h-full object-cover rounded-full" />
                                                    ) : (
                                                        seller.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className={s.requestName}>{seller.name}</h3>
                                                    <p className={s.requestDate}>
                                                        <HiCalendar /> Registered: {new Date(seller.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className={s.contactInfo}>
                                                <div className={s.contactItem}>
                                                    <HiMail className="text-text-muted shrink-0" size={18} />
                                                    <span>{seller.email}</span>
                                                </div>
                                                {seller.phone && (
                                                    <div className={s.contactItem}>
                                                        <HiPhone className="text-text-muted shrink-0" size={18} />
                                                        <span>{seller.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button 
                                                onClick={() => handleApprove(seller._id)}
                                                className={s.approveButton}
                                            >
                                                <HiCheck size={18} /> Approve Seller
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={s.emptyState}>
                                    <HiUser size={48} className={s.emptyStateIcon} />
                                    <p>No pending seller requests at the moment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminSellerRequests;
