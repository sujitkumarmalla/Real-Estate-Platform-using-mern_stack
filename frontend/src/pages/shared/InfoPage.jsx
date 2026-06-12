import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { contactStyles as c } from '../../assets/dummyStyles';
import { HiPhone, HiMail, HiLocationMarker, HiCheckCircle } from 'react-icons/hi';

const InfoPage = () => {
    const location = useLocation();
    const path = location.pathname;

    // Contact Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'buyer',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await axios.post(`${API_URL.replace(/\/$/, '')}/api/contact`, formData);
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'buyer',
                message: ''
            });
        } catch (err) {
            console.error("Contact form error", err);
            setError(err.response?.data?.message || 'Failed to send contact inquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    let title = "Information";
    let content = null;

    if (path === '/about') {
        title = "About Us";
        content = (
            <div className="flex flex-col gap-6 text-left text-text-muted leading-relaxed">
                <p className="text-lg text-text-main font-semibold">Welcome to RealEstate Platform – the most advanced real estate search app.</p>
                <p>We are dedicated to helping buyers, tenants, and sellers connect seamlessly through verified listings, modern tools, and robust messaging. Our mission is to make finding a place to call home an enjoyable and transparent journey.</p>
                <p>Founded by experts in technology and property operations, our platform features 3D virtual tours, real-time messaging, map searches, and verified seller credentials. We eliminate the friction in traditional real estate to bring you unmatched value.</p>
                <h3 className="text-xl font-bold text-text-main mt-4">Our Core Values</h3>
                <ul className="list-disc pl-6 flex flex-col gap-2">
                    <li><strong>Trust & Verification:</strong> Every listing is strictly audited to protect against scams.</li>
                    <li><strong>Innovation:</strong> Continuously building AI-driven matching and smart communications.</li>
                    <li><strong>Customer Focus:</strong> 24/7 service alerts and zero commission bypass options.</li>
                </ul>
            </div>
        );
    } else if (path === '/faq') {
        title = "Frequently Asked Questions (FAQ)";
        content = (
            <div className="flex flex-col gap-8 text-left">
                {[
                    { q: "How do I list my property?", a: "To list a property, create a Seller account, navigate to your dashboard, click 'Add Property', fill out the details and upload high-quality images." },
                    { q: "Are the properties verified?", a: "Yes, our team audits listing documents and title deeds before granting the verified badge to listings." },
                    { q: "How do messaging credits work for sellers?", a: "Sellers receive 100 free credits on registration. Every message sent to buyers consumes 1 credit. Additional credit packs can be purchased on our Upgrade page." },
                    { q: "Can I cancel my credit purchases?", a: "Purchases are processed securely via Stripe. Due to the digital delivery of credits, all sales are final. Please contact support if you face transaction errors." }
                ].map((item, idx) => (
                    <div key={idx} className="border-b border-border pb-6">
                        <h4 className="font-bold text-lg text-text-main mb-2">Q: {item.q}</h4>
                        <p className="text-text-muted">{item.a}</p>
                    </div>
                ))}
            </div>
        );
    } else if (path === '/privacy') {
        title = "Privacy Policy";
        content = (
            <div className="flex flex-col gap-6 text-left text-text-muted leading-relaxed">
                <p>Last updated: June 12, 2026</p>
                <p>Your privacy is important to us. This policy describes how we collect, use, and share information when you access or use our RealEstate Platform.</p>
                <h3 className="text-xl font-bold text-text-main mt-4">1. Information We Collect</h3>
                <p>We collect information you provide to us directly, such as your name, email address, phone number, password, profile picture, and listing details.</p>
                <h3 className="text-xl font-bold text-text-main mt-4">2. Stripe & Financial Transactions</h3>
                <p>All payments are securely processed by Stripe. We do not store or process your full credit card information on our servers; Stripe provides us with tokenized confirmation of payment success.</p>
                <h3 className="text-xl font-bold text-text-main mt-4">3. Data Sharing</h3>
                <p>We do not sell your personal data. We only share details with prospective buyers (like name and phone) when you approve an inquiry or request contact details.</p>
            </div>
        );
    } else if (path === '/terms') {
        title = "Terms of Service";
        content = (
            <div className="flex flex-col gap-6 text-left text-text-muted leading-relaxed">
                <p>Last updated: June 12, 2026</p>
                <p>By registering or using the RealEstate Platform, you agree to comply with and be bound by these Terms of Service.</p>
                <h3 className="text-xl font-bold text-text-main mt-4">1. User Account Terms</h3>
                <p>You must provide accurate information. Seller accounts must not list duplicate properties or post misleading pricing. Fraudulent listings will be blocked immediately.</p>
                <h3 className="text-xl font-bold text-text-main mt-4">2. Messaging Credits</h3>
                <p>Sellers are allocated 100 free credits. Standard communication consumes 1 credit per sent message. You agree to use the messaging features strictly for listing inquiries.</p>
                <h3 className="text-xl font-bold text-text-main mt-4">3. Limitation of Liability</h3>
                <p>We do not guarantee the completeness or accuracy of any user-submitted property listings. All agreements are signed directly between the buyer and the seller.</p>
            </div>
        );
    }

    if (path === '/contact') {
        return (
            <div className={c.container}>
                <Navbar />
                <main className={c.mainContainer}>
                    {/* Header */}
                    <div className={c.header}>
                        <h1 className={c.heading}>Contact Us</h1>
                        <p className={c.subheading}>Have questions or feedback? We would love to hear from you. Send us a message below.</p>
                    </div>

                    {/* Grid */}
                    <div className={c.grid}>
                        {/* Left Info Column */}
                        <div className={c.contactInfoContainer}>
                            <div className={c.contactInfoCard}>
                                <div className={`${c.contactItem} ${c.contactItemMarginBottom}`}>
                                    <div className={c.contactIconWrapper}>
                                        <HiPhone size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className={c.contactTitle}>Phone Number</h4>
                                        <p className={c.contactDetail}>+1 (234) 567-890</p>
                                    </div>
                                </div>

                                <div className={`${c.contactItem} ${c.contactItemMarginBottom}`}>
                                    <div className={c.contactIconWrapperAlt}>
                                        <HiMail size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className={c.contactTitle}>Email Address</h4>
                                        <p className={c.contactDetail}>mallasonu123000@gmail.com</p>
                                    </div>
                                </div>

                                <div className={c.contactItem}>
                                    <div className={c.contactIconWrapper}>
                                        <HiLocationMarker size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className={c.contactTitle}>Office Location</h4>
                                        <p className={c.contactDetail}>123 Real Estate Ave, Luxury City,Rasulgarh,BBSR</p>
                                    </div>
                                </div>
                            </div>

                            <div className={c.quickSupportCard}>
                                <h4 className={c.quickSupportTitle}>Need Quick Support?</h4>
                                <p className={c.quickSupportText}>Our average response time is under 2 hours. Log in to chat directly with a support agent.</p>
                            </div>
                        </div>

                        {/* Right Form Column */}
                        <div className={c.formCard}>
                            {submitted ? (
                                <div className={c.successContainer}>
                                    <div className="text-green-500 mb-6 flex justify-center">
                                        <HiCheckCircle size={64} />
                                    </div>
                                    <h3 className={c.successTitle}>Thank You!</h3>
                                    <p className={c.successMessage}>Your message has been sent successfully. We will get back to you shortly.</p>
                                    <button onClick={() => setSubmitted(false)} className={c.successButton}>Send Another Message</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className={c.form}>
                                    {error && <div className={c.errorMessage}>{error}</div>}
                                    
                                    <div className={c.formTwoColGrid}>
                                        <div className={c.inputGroup}>
                                            <label className={c.label}>Your Name</label>
                                            <input 
                                                type="text" 
                                                required 
                                                className={c.input} 
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className={c.inputGroup}>
                                            <label className={c.label}>Email Address</label>
                                            <input 
                                                type="email" 
                                                required 
                                                className={c.input} 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className={c.formTwoColGrid}>
                                        <div className={c.inputGroup}>
                                            <label className={c.label}>Phone Number</label>
                                            <input 
                                                type="text" 
                                                className={c.input} 
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        <div className={c.inputGroup}>
                                            <label className={c.label}>I am a...</label>
                                            <select 
                                                className={c.input}
                                                value={formData.role}
                                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                            >
                                                <option value="buyer">Buyer / Tenant</option>
                                                <option value="seller">Seller / Agent</option>
                                                <option value="other">Other Inquiry</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={c.inputGroup}>
                                        <label className={c.label}>Your Message</label>
                                        <textarea 
                                            required 
                                            rows="5"
                                            className={`${c.input} ${c.textarea}`}
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            placeholder="Write your details here..."
                                        ></textarea>
                                    </div>

                                    <button type="submit" disabled={submitting} className={c.submitButton}>
                                        {submitting ? 'Sending Message...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-bg-alt pt-32">
            <Navbar />
            <main className="container flex-1 max-w-[800px] py-16 px-6 fade-in">
                <div className="card-premium p-10 bg-white">
                    <h1 className="text-3xl font-extrabold text-text-main mb-8 border-b border-border pb-4">{title}</h1>
                    {content}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default InfoPage;
