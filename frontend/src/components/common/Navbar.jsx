import React, { useState } from 'react';
import { navbarStyles as s } from '../../assets/dummyStyles';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const { user, logout } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `${s.navLink} ${isActive ? 'text-primary bg-primary/10' : ''}`;
    };

    const navLinks = (
        <>
            {(!user || user.role !== "admin") && (
                <>
                    <Link
                        to="/"
                        className={getLinkClass("/")}
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </Link>

                    <Link
                        to="/properties"
                        className={getLinkClass("/properties")}
                        onClick={() => setIsOpen(false)}
                    >
                        Properties
                    </Link>

                    <Link
                        to="/contact"
                        className={getLinkClass("/contact")}
                        onClick={() => setIsOpen(false)}
                    >
                        Contact Us
                    </Link>

                    <Link
                        to="/location"
                        className={getLinkClass("/location")}
                        onClick={() => setIsOpen(false)}
                    >
                        Location
                    </Link>
                </>
            )}

            {user && user.role === "buyer" && (
                <Link
                    to="/dashboard"
                    className={getLinkClass("/dashboard")}
                    onClick={() => setIsOpen(false)}
                >
                    My Dashboard
                </Link>
            )}

            {user && user.role === "seller" && (
                <Link
                    to="/seller"
                    className={getLinkClass("/seller")}
                    onClick={() => setIsOpen(false)}
                >
                    Seller Panel
                </Link>
            )}

            {user && user.role === "admin" && (
                <Link
                    to="/admin"
                    className={getLinkClass("/admin")}
                    onClick={() => setIsOpen(false)}
                >
                    Admin Panel
                </Link>
            )}

            {user && user.role !== "admin" && (
                <Link
                    to="/chat"
                    className={getLinkClass("/chat")}
                    onClick={() => setIsOpen(false)}
                >
                    Messages
                </Link>
            )}

            {!user && (
                <>
                    <Link
                        to="/login"
                        className={getLinkClass("/login")}
                        onClick={() => setIsOpen(false)}
                    >
                        Login
                    </Link>
                </>
            )}
        </>
    );

    return (
        <>
            <nav className={s.nav}>
                <div className={s.container}>
                    <div className={s.grid}>

                        <div>
                            <Logo />
                        </div>

                        <div className={s.desktopMenu}>
                            {navLinks}
                        </div>

                        <div className={s.rightSection}>

                            {user ? (
                                <div className={s.userSection}>
                                    <Link to="/profile" className="flex items-center">
                                        <img
                                            src={
                                                user.profilePic ||
                                                `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                                            }
                                            alt="Profile"
                                            className={s.avatar}
                                        />
                                    </Link>

                                    <button
                                        onClick={logout}
                                        className={s.logoutButton}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : null}

                            <div
                                className={s.mobileToggle}
                                onClick={toggleMenu}
                            >
                                {isOpen ? (
                                    <HiX size={28} />
                                ) : (
                                    <HiMenuAlt3 size={28} />
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </nav>

            {/* Backdrop */}
            <div
                className={s.backdrop(isOpen)}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Mobile Drawer */}
            <div className={s.drawer(isOpen)}>

                <div className={s.drawerHeader}>
                    <Logo onClick={() => setIsOpen(false)} />

                    <HiX
                        size={28}
                        onClick={() => setIsOpen(false)}
                        className={s.drawerCloseIcon}
                    />
                </div>

                <div className={s.drawerNavLinks}>
                    {navLinks}
                </div>
                                    {
                                        user && (
                                            <div className={s.drawerUserSection}>
                                                <div className={s.drawerUserInfo}>
                                                    <img  src={
                  user.profilePic ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                }
                alt="Profile"
                className={s.drawerAvatar} />
                <div className={s.drawerUserName}>{user.name}</div>
                <div className={s.drawerUserEmail}>{user.email}</div>

                                                </div>
                                                <button className={s.drawerLogoutButton} onClick={logout}>
                                                     Logout
                                                 </button>
                                            </div>
                                        )
                                    }
            </div>
        </>
    );
};

export default Navbar;