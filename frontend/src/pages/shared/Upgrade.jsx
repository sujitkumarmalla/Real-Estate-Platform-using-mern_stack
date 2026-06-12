import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import SellerSidebar from '../../components/seller/SellerSidebar';
import { HiCheck, HiOutlineDatabase, HiBadgeCheck, HiLightningBolt } from 'react-icons/hi';

const Upgrade = () => {
    const navigate = useNavigate();
    const { user, token, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Check URL query parameters for Stripe redirection results
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'true') {
            setStatusMessage({ type: 'success', text: 'Payment successful! Your credits have been updated.' });
            refreshUser();
        } else if (params.get('canceled') === 'true') {
            setStatusMessage({ type: 'error', text: 'Payment was canceled. You can try again whenever you are ready.' });
        }
    }, []);

    const handleUpgrade = async (planId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL.replace(/\/$/, '')}/api/payment/create-checkout-session`, {
                planId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.data.url) {
                // Redirect user to Stripe Checkout
                window.location.href = res.data.url;
            }
        } catch (err) {
            console.error("Stripe session redirect failed", err);
            setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to start payment process.' });
            setLoading(false);
        }
    };

    const plans = [
        {
            id: 'bronze',
            name: 'Bronze Plan',
            price: '₹299',
            credits: '50 Credits',
            description: 'Perfect for small sellers getting started with client inquiries.',
            features: [
                '50 messaging credits',
                '₹6 per message cost',
                'Standard listing support',
                '24/7 client alerts'
            ],
            color: 'from-amber-700 to-amber-900',
            buttonStyle: 'bg-amber-800 hover:bg-amber-900 text-white'
        },
        {
            id: 'silver',
            name: 'Silver Plan',
            price: '₹999',
            credits: '200 Credits',
            description: 'Recommended for active agents listing multiple premium homes.',
            features: [
                '200 messaging credits',
                '₹5 per message cost',
                'Priority inbox visibility',
                'Verified seller badge',
                'Advanced property analytics'
            ],
            color: 'from-slate-400 to-slate-600',
            buttonStyle: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 scale-105',
            badge: 'Most Popular'
        },
        {
            id: 'gold',
            name: 'Gold Plan',
            price: '₹1999',
            credits: '1000 Credits',
            description: 'Best choice for real estate agencies and top-tier builders.',
            features: [
                '1000 messaging credits',
                '₹2 per message cost',
                'Double visibility boost',
                'Exclusive gold profile badge',
                'Dedicated account manager',
                'API auto-leads integration'
            ],
            color: 'from-yellow-500 to-yellow-700',
            buttonStyle: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        }
    ];

    return (
        <div className={`flex flex-col min-h-screen bg-bg-alt ${user?.role === 'buyer' ? 'pt-32' : ''}`}>
            {user?.role === 'buyer' ? <Navbar /> : <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}

            <div className={`flex-1 flex flex-col p-6 md:p-12 ${user?.role !== 'buyer' ? 'md:ml-[260px]' : ''}`}>
                <main className="max-w-[1200px] w-full mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-primary rounded-full text-xs font-bold uppercase mb-4 tracking-wider">
                            <HiLightningBolt /> Upgrade Features
                        </div>
                        <h1 className="text-[2.5rem] font-extrabold text-text-main mb-4 leading-tight">
                            Power Up Your Messaging Limits
                        </h1>
                        <p className="text-text-muted text-base max-w-[600px] mx-auto">
                            Upgrade your credit balance to communicate with potential buyers instantly. All accounts start with 100 free credits.
                        </p>
                    </div>

                    {/* Status Alert Banner */}
                    {statusMessage.text && (
                        <div className={`max-w-[800px] mx-auto p-4 rounded-2xl mb-10 text-center text-sm font-bold border ${statusMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            {statusMessage.text}
                        </div>
                    )}

                    {/* Current Balance */}
                    <div className="card-premium p-6 max-w-[500px] mx-auto mb-16 flex items-center justify-between gap-6 bg-white shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary-light text-primary rounded-2xl flex items-center justify-center">
                                <HiOutlineDatabase size={28} />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Your Account Balance</p>
                                <h3 className="text-2xl font-extrabold text-text-main">
                                    {user?.credits ?? 100} Credits
                                </h3>
                            </div>
                        </div>
                        <span className="px-3 py-1.5 bg-primary-light text-primary text-xs font-bold rounded-full uppercase">
                            Active
                        </span>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
                        {plans.map((plan) => (
                            <div 
                                key={plan.id} 
                                className={`card-premium p-8 bg-white border border-border flex flex-col relative transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl ${plan.id === 'silver' ? 'border-primary ring-2 ring-primary/20' : ''}`}
                            >
                                {plan.badge && (
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                                        {plan.badge}
                                    </span>
                                )}

                                <div className="text-left flex-1">
                                    <h3 className="text-lg font-bold text-text-main mb-1">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-4xl font-black text-text-main">{plan.price}</span>
                                        <span className="text-xs text-text-muted">one-time</span>
                                    </div>
                                    <div className={`h-1.5 w-16 bg-gradient-to-r ${plan.color} rounded-full mb-6`}></div>
                                    
                                    <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wide flex items-center gap-1">
                                        <HiBadgeCheck size={16} /> Gives {plan.credits}
                                    </p>
                                    <p className="text-sm text-text-muted mb-8 leading-relaxed">
                                        {plan.description}
                                    </p>

                                    <ul className="flex flex-col gap-4 mb-10">
                                        {plan.features.map((feat, index) => (
                                            <li key={index} className="flex items-start gap-3 text-sm text-[#475569]">
                                                <HiCheck className="text-green-500 shrink-0 mt-0.5" size={18} />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button 
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={loading}
                                    className={`btn w-full py-4.5 rounded-2xl font-bold transition-all ${plan.buttonStyle} disabled:opacity-50`}
                                >
                                    {loading ? 'Processing...' : 'Buy Now'}
                                </button>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            {user?.role === 'buyer' && <Footer />}
        </div>
    );
};

export default Upgrade;
