import React from 'react';
import { NavLink } from 'react-router-dom';
import { sellerSidebarStyles as s } from '../../assets/dummyStyles';
import { HiChartBar, HiHome, HiPlusCircle, HiChatAlt2, HiLogout, HiX, HiUser, HiCreditCard } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const SellerSidebar = ({ isOpen, setIsOpen }) => {
    const { logout, user } = useAuth();

    const menuItems = [
        { path: '/seller', icon: <HiChartBar size={20} />, label: 'Dashboard' },
        { path: '/seller/properties', icon: <HiHome size={20} />, label: 'My Properties' },
        { path: '/seller/add-property', icon: <HiPlusCircle size={20} />, label: 'Add Property' },
        { path: '/seller/inquiries', icon: <HiChatAlt2 size={20} />, label: 'Inquiries' },
        { path: '/upgrade', icon: <HiCreditCard size={20} />, label: 'Upgrade' },
    ];

    return (
        <>
            <div 
                className={`${s.backdrop} ${isOpen ? s.backdropVisible : s.backdropHidden}`} 
                onClick={() => setIsOpen(false)}
            ></div>
            
            <div className={`${s.sidebar} ${isOpen ? s.sidebarOpen : s.sidebarClosed}`}>
                <div className={s.logoContainer}>
                    <Logo />
                    <button 
                        className="md:hidden text-text-muted" 
                        onClick={() => setIsOpen(false)}
                    >
                        <HiX size={24} />
                    </button>
                </div>

                <nav className={s.nav}>
                    {menuItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            to={item.path} 
                            end
                            className={({ isActive }) => `${s.navLink} ${isActive ? s.navLinkActive : s.navLinkInactive}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="px-6 py-4 border-t border-border mt-auto mb-2 flex items-center justify-between text-xs font-bold text-text-muted">
                    <span className="uppercase">My Balance</span>
                    <span className="text-primary bg-primary-light px-2.5 py-1 rounded-lg">
                        {user?.credits ?? 100} Cr
                    </span>
                </div>

                <div className={s.logoutContainer}>
                    <button onClick={logout} className={s.logoutButton}>
                        <HiLogout size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SellerSidebar;
