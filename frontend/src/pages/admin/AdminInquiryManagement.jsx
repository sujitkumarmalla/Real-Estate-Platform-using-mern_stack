import React, { useEffect, useState } from 'react';
import { adminInquiriesStyles as s, adminLayoutStyles as ls } from '../../assets/dummyStyles';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { HiCalendar, HiHome, HiUser, HiChatAlt } from 'react-icons/hi';

const AdminInquiryManagement = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token } = useAuth();

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/admin/inquires`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInquiries(res.data.inquiries || res.data.inquires || []);
        } catch (error) {
            console.error("Failed to fetch inquiries", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className={ls.layout}>
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={ls.mainWrapper}>
                <main className={ls.mainContent}>
                    <div className={s.headerContainer}>
                        <h1 className={s.headerTitle}>All Inquiries</h1>
                        <p className={s.headerSubtitle}>Manage and monitor all buyer-seller interactions</p>
                    </div>

                    <div className={s.listContainer}>
                        {inquiries.length > 0 ? (
                            inquiries.map(inq => (
                                <div key={inq._id} className={s.inquiryCard}>
                                    <div className={s.cardTopSection}>
                                        <div className={s.propertyInfoWrapper}>
                                            <div className={s.propertyIconWrapper}>
                                                <HiHome size={24} />
                                            </div>
                                            <div className={s.propertyTextWrapper}>
                                                <p className={s.propertyTitle}>{inq.property?.title}</p>
                                                <p className={s.propertyId}>ID: {inq.property?._id}</p>
                                            </div>
                                        </div>
                                        <div className={s.dateWrapper}>
                                            <HiCalendar className={s.dateIcon} />
                                            {new Date(inq.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className={s.detailsGrid}>
                                        <div className={s.detailCard}>
                                            <p className={s.detailLabel}>Buyer Information</p>
                                            <div className="flex items-center gap-3">
                                                <HiUser className="text-text-muted" />
                                                <div>
                                                    <p className={s.detailName}>{inq.buyer?.name}</p>
                                                    <p className={s.detailEmail}>{inq.buyer?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={s.detailCard}>
                                            <p className={s.detailLabel}>Seller Information</p>
                                            <div className="flex items-center gap-3">
                                                <HiUser className="text-text-muted" />
                                                <div>
                                                    <p className={s.detailName}>{inq.seller?.name}</p>
                                                    <p className={s.detailEmail}>{inq.seller?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={s.messageContainer}>
                                        <p className={s.messageHeader}>
                                            <HiChatAlt /> Inquiry Message
                                        </p>
                                        <p className={s.messageText}>"{inq.message}"</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={s.emptyState}>
                                <div className={s.emptyIconWrapper}>
                                    <HiChatAlt size={48} className="mx-auto" />
                                </div>
                                <p className={s.emptyText}>No inquiries found on the platform.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminInquiryManagement;
