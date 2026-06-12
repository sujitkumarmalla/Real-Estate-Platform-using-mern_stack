import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { landingPageStyles as s } from '../../assets/dummyStyles';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Logo from './Logo';
import axios from 'axios';
import API_URL from '../../config';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setSubmitting(true);
        setStatus({ type: '', text: '' });
        try {
            const res = await axios.post(`${API_URL.replace(/\/$/, '')}/api/newsletter/subscribe`, { email });
            setStatus({ type: 'success', text: res.data.message });
            setEmail('');
        } catch (err) {
            console.error("Newsletter error", err);
            setStatus({ type: 'error', text: err.response?.data?.message || 'Subscription failed. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <footer className={s.footer}>
            <div className={s.container}>
                <div className={s.footerMainGrid}>
                    <div className={s.footerBrand}>
                        <Logo className="mb-6" />
                        <p className={s.brandDesc}>
                            The most advanced real estate search platform owned by Mr. Sujit Kumar Malla. Find your dream home with ease and confidence.
                        </p>
                        <div className={s.socialIcons}>
                            <a href="https://www.facebook.com/share/1H53tpfg5K/" target="_blank" rel="noopener noreferrer" className={s.socialIcon}><FaFacebook /></a>
                            <a href="https://x.com/sujitsonu18" target="_blank" rel="noopener noreferrer" className={s.socialIcon}><FaTwitter /></a>
                            <a href="https://www.instagram.com/_.hey._.sonu?igsh=dDNkY2RlNm93OGR4" target="_blank" rel="noopener noreferrer" className={s.socialIcon}><FaInstagram /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className={s.footerHeading}>Quick Links</h4>
                        <div className={s.footerLinks}>
                            <Link to="/properties" className={s.footerLink}>Browse Properties</Link>
                            <Link to="/about" className={s.footerLink}>About Us</Link>
                            <Link to="/contact" className={s.footerLink}>Contact</Link>
                            <Link to="/faq" className={s.footerLink}>FAQ</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={s.footerHeading}>Contact Us</h4>
                        <div className={s.footerLinks}>
                            <div className={s.contactInfo}>
                                <HiPhone className={s.contactIcon} />
                                <span>+1 (234) 567-890</span>
                            </div>
                            <div className={s.contactInfo}>
                                <HiMail className={s.contactIcon} />
                                <span>mallasonu123000@gmail.com</span>
                            </div>
                            <div className={s.contactInfoStart}>
                                <HiLocationMarker className={s.contactIcon} />
                                <span>123 Real Estate Ave,<br />Luxury City, NY 10001</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className={s.footerHeading}>Newsletter</h4>
                        <p className={s.newsletterDesc}>Subscribe to get the latest property updates and news.</p>
                        <form onSubmit={handleSubscribe} className={s.newsletterInputWrapper}>
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                required
                                className={s.newsletterInput} 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit" disabled={submitting} className={s.newsletterButton}>
                                {submitting ? '...' : 'Join'}
                            </button>
                        </form>
                        {status.text && (
                            <p className={`text-xs mt-2 font-bold text-left ${status.type === 'success' ? 'text-primary' : 'text-red-500'}`}>
                                {status.text}
                            </p>
                        )}
                    </div>
                </div>

                <div className={s.bottomBar}>
                    <div className={s.bottomBarFlex}>
                        <p>© 2026 RealEstate Platform by Mr. Sujit Kumar Malla. All rights reserved.</p>
                        <div className={s.footerLegalLinks}>
                            <Link to="/privacy" className={s.footerLink}>Privacy Policy</Link>
                            <Link to="/terms" className={s.footerLink}>Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
