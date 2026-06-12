import React, { useEffect, useState } from 'react';
import { adminDashboardStyles as ds } from '../../assets/dummyStyles';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import PropertyCard from '../../components/PropertyCard';
import Footer from '../../components/common/Footer';

const BuyerDashboard = () => {
    const [wishlist, setWishlist] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('wishlist');
    const { token } = useAuth();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [wishRes, inqRes] = await Promise.all([
                axios.get(`${API_URL.replace(/\/$/, '')}/api/wishlist`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL.replace(/\/$/, '')}/api/inquiry/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setWishlist(wishRes.data.data || []);
            setInquiries(inqRes.data.inquiries || []);
        } catch (error) {
            console.error("Failed to fetch buyer data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleWishlist = async (id) => {
        try {
            await axios.delete(`${API_URL.replace(/\/$/, '')}/api/wishlist/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(prev => prev.filter(item => item.property?._id !== id));
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className="bg-bg-alt min-h-screen flex flex-col">
            <Navbar />
            <main className="container flex-1 pt-32 pb-20 px-6">
                <div className={ds.headerContainer}>
                    <div>
                        <h1 className={ds.pageTitle}>My Dashboard</h1>
                        <p className={ds.pageSubtitle}>Manage your property interests and inquiries</p>
                    </div>
                </div>

                <div className="flex gap-8 border-b border-border mb-10">
                    <button 
                        className={`pb-4 text-sm font-bold tracking-wider uppercase transition-all ${activeTab === 'wishlist' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`}
                        onClick={() => setActiveTab('wishlist')}
                    >
                        Wishlist ({wishlist.length})
                    </button>
                    <button 
                        className={`pb-4 text-sm font-bold tracking-wider uppercase transition-all ${activeTab === 'inquiries' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`}
                        onClick={() => setActiveTab('inquiries')}
                    >
                        My Inquiries ({inquiries.length})
                    </button>
                </div>

                {activeTab === 'wishlist' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlist.length > 0 ? (
                            wishlist.map(item => (
                                item.property && (
                                    <PropertyCard 
                                        key={item.property._id} 
                                        property={item.property} 
                                        isWishlisted={true}
                                        onToggleWishlist={handleToggleWishlist}
                                    />
                                )
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-text-muted bg-white rounded-3xl border border-border">
                                <p>Your wishlist is empty. Start exploring properties!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {inquiries.length > 0 ? (
                            inquiries.map(inq => (
                                <div key={inq._id} className="card-premium p-6 flex flex-col sm:flex-row justify-between gap-6">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{inq.property?.title}</h3>
                                        <p className="text-sm text-text-muted mb-4">{inq.property?.city}, {inq.property?.area}</p>
                                        <div className="bg-bg-alt p-4 rounded-xl text-sm italic">
                                            "{inq.message}"
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between shrink-0">
                                        <span className="px-3 py-1 bg-primary-light text-primary text-xs font-bold rounded-full uppercase">
                                            Inquiry Sent
                                        </span>
                                        <p className="text-xs text-text-muted mt-4">
                                            {new Date(inq.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center text-text-muted bg-white rounded-3xl border border-border">
                                <p>You haven't made any inquiries yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default BuyerDashboard;
