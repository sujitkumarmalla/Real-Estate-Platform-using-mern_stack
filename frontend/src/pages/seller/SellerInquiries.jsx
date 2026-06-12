import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerLayoutStyles as ls, adminDashboardStyles as ds } from '../../assets/dummyStyles';
import SellerSidebar from '../../components/seller/SellerSidebar';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { HiChatAlt, HiUser, HiPhone, HiMail, HiCalendar } from 'react-icons/hi';

const SellerInquiries = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token } = useAuth();

    const handleReply = async (inq) => {
        try {
            const res = await axios.post(`${API_URL.replace(/\/$/, '')}/api/chat/start`, {
                propertyId: inq.property?._id,
                buyerId: inq.buyer?._id,
                sellerId: inq.seller
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/chat?id=${res.data._id}`);
        } catch (err) {
            console.error("Failed to start chat from lead:", err);
            alert("Failed to start chat. Please try again.");
        }
    };

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/inquiry/seller`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInquiries(res.data.inquiries || []);
        } catch (error) {
            console.error("Failed to fetch seller inquiries", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className={ls.container}>
            <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={ls.contentWrapper}>
                <main className={ls.main}>
                    <div className={ds.headerContainer}>
                        <div>
                            <h1 className={ds.pageTitle}>Buyer Leads</h1>
                            <p className={ds.pageSubtitle}>People interested in your properties</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {inquiries.length > 0 ? (
                            inquiries.map(inq => (
                                <div key={inq._id} className="card-premium p-6 md:p-8">
                                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="bg-primary-light text-primary p-2 rounded-lg">
                                                    <HiChatAlt size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">Inquiry for: {inq.property?.title}</h3>
                                                    <p className="text-xs text-text-muted">Received on {new Date(inq.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-bg-alt p-6 rounded-2xl border-l-4 border-primary">
                                                <p className="text-text-main leading-relaxed italic">"{inq.message}"</p>
                                            </div>
                                        </div>

                                        <div className="lg:w-80 bg-white border border-border p-6 rounded-2xl">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">Contact Information</p>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center gap-3">
                                                    <HiUser className="text-primary" />
                                                    <span className="text-sm font-bold">{inq.buyer?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <HiMail className="text-primary" />
                                                    <span className="text-sm break-all">{inq.buyer?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <HiPhone className="text-primary" />
                                                    <span className="text-sm">{inq.buyer?.phone || 'Not provided'}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleReply(inq)}
                                                className="btn btn-primary w-full mt-6 py-2 text-sm"
                                            >
                                                Reply to Lead
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 text-center text-text-muted bg-white rounded-3xl border border-border">
                                <HiChatAlt size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No inquiries received yet. Great listings get more leads!</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SellerInquiries;
