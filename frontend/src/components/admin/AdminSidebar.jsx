import React from 'react';
import { NavLink } from 'react-router-dom';
import { adminSidebarStyles as s } from '../../assets/dummyStyles';
import { HiChartBar, HiUsers, HiHome, HiChatAlt2, HiLogout, HiX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const { logout } = useAuth();

    const menuItems = [
        { path: '/admin', icon: <HiChartBar size={20} />, label: 'Dashboard' },
        { path: '/admin/users', icon: <HiUsers size={20} />, label: 'Manage Users' },
        { path: '/admin/properties', icon: <HiHome size={20} />, label: 'All Properties' },
        { path: '/admin/inquiries', icon: <HiChatAlt2 size={20} />, label: 'Inquiries' },
    ];

    return (
        <>
            <div 
                className={s.backdrop(isOpen)} 
                onClick={() => setIsOpen(false)}
            ></div>
            
            <div className={s.sidebar(isOpen)}>
                <div className={s.logoContainer}>
                    <Logo />
                    <button 
                        className="md:hidden text-text-muted" 
                        onClick={() => setIsOpen(false)}
                    >
                        <HiX size={24} />
                    </button>
                </div>

                <nav className={s.navContainer}>
                    {menuItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            to={item.path} 
                            end
                            className={({ isActive }) => s.navLink(isActive)}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

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

export default AdminSidebar;
