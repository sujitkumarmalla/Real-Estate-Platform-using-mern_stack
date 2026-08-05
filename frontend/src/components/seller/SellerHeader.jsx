import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiMenu, HiChatAlt2, HiUser } from 'react-icons/hi';

const SellerHeader = ({ setSidebarOpen, title, subtitle, children }) => {
    const { user } = useAuth();

    return (
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4 text-left border-b border-border pb-5">
            {/* Left side: Title and Mobile Toggle */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-2 rounded-xl border border-border bg-white text-text-main hover:bg-gray-50 cursor-pointer"
                >
                    <HiMenu size={22} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-text-main tracking-tight leading-none">{title}</h1>
                    {subtitle && <p className="text-xs text-text-muted mt-2">{subtitle}</p>}
                </div>
            </div>

            {/* Right side: Messages and Profile Avatar */}
            <div className="flex items-center gap-3.5 ml-auto">
                {children}
                <Link 
                    to="/chat"
                    className="w-10 h-10 rounded-xl border border-border bg-white text-text-main flex items-center justify-center hover:bg-primary-light hover:text-primary transition-all duration-200"
                    title="Messages"
                >
                    <HiChatAlt2 size={20} />
                </Link>
                
                <Link 
                    to="/profile"
                    className="w-10 h-10 rounded-full border-2 border-primary bg-primary-light flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-200"
                    title="Profile"
                >
                    {user?.profilePic ? (
                        <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                        <span className="font-bold text-sm text-primary">
                            {user?.name ? user.name.charAt(0).toUpperCase() : <HiUser size={18} />}
                        </span>
                    )}
                </Link>
            </div>
        </div>
    );
};

export default SellerHeader;
