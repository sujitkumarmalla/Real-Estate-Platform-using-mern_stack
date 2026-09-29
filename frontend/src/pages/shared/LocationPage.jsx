import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const LocationPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-bg-alt">
            <Navbar />
            <main className="flex-1 pt-32 pb-20 px-4 md:px-8 max-w-[1280px] mx-auto w-full animate-slide-up">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-text-main mt-4 mb-4">Visit Us in Real Time</h1>
                    <p className="text-text-muted max-w-2xl mx-auto">Find our headquarters in GGP Colony, Bhubaneswar. Feel free to drop by for a cup of coffee and discuss your real estate needs.</p>
                </div>

                <div className="bg-white p-4 md:p-8 rounded-3xl shadow-lg border border-border">
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-text-main mb-2">Corporate Headquarters</h3>
                            <p className="text-text-muted mb-6">GGP Colony, Rasulgarh, Bhubaneswar, Odisha 751025</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-light text-primary rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main">Business Hours</p>
                                        <p className="text-sm text-text-muted">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-light text-primary rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main">Contact Us</p>
                                        <p className="text-sm text-text-muted">+91 98765 43210</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="rounded-2xl overflow-hidden shadow-inner border border-border h-[500px]">
                        <iframe 
                            src="https://maps.google.com/maps?q=GGP%20Colony,%20Bhubaneswar&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Real Time Office Location"
                        ></iframe>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LocationPage;
