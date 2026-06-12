import React, { useEffect, useState } from 'react';
import { adminUsersStyles as s, adminLayoutStyles as ls } from '../../assets/dummyStyles';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { HiTrash, HiBan, HiCheckCircle, HiUser, HiMail, HiPhone } from 'react-icons/hi';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { token } = useAuth();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.users || []);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleBlock = async (id, isBlocked) => {
        try {
            await axios.patch(`${API_URL.replace(/\/$/, '')}/api/admin/users/${id}/block`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !isBlocked } : u));
            fetchUsers(); // Refresh to be sure
        } catch (error) {
            console.error("Failed to toggle block", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`${API_URL.replace(/\/$/, '')}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className={ls.layout}>
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={ls.mainWrapper}>
                <main className={ls.mainContent}>
                    <div className={s.containerHeader}>
                        <div>
                            <h1 className={s.headerTitle}>User Management</h1>
                            <p className={s.headerSubtitle}>Monitor and manage platform users</p>
                        </div>
                        <div className={s.userCount}>
                            Total Users: <span className={s.userCountSpan}>{users.length}</span>
                        </div>
                    </div>

                    <div className={s.cardContainer}>
                        <div className={s.tableWrapper}>
                            <table className={s.table}>
                                <thead className={s.thead}>
                                    <tr>
                                        <th className={s.thUserInfo}>User Details</th>
                                        <th className={s.thRole}>Role</th>
                                        <th className={s.thContact}>Contact</th>
                                        <th className={s.thStatus}>Status</th>
                                        <th className={s.thActions}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.map(u => (
                                        <tr key={u._id} className={s.tableRow}>
                                            <td className={s.tdUserInfo}>
                                                <div className="flex items-center gap-4">
                                                    <div className={s.userAvatar}>
                                                        {u.profilePic ? <img src={u.profilePic} className="w-full h-full object-cover rounded-full" /> : <HiUser size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className={s.userInfoName}>{u.name}</p>
                                                        <p className={s.userInfoId}>ID: {u._id.slice(-8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={s.tdRole}>
                                                <span className={s.roleBadge(u.role)}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className={s.tdContact}>
                                                <div className={s.contactWrapper}>
                                                    <p className={s.contactEmail}><HiMail className="text-text-muted" /> {u.email}</p>
                                                    {u.phone && <p className={s.contactPhone}><HiPhone className="text-text-muted" /> {u.phone}</p>}
                                                </div>
                                            </td>
                                            <td className={s.tdStatus}>
                                                {u.isBlocked ? (
                                                    <span className={s.statusBadgeBlocked}>Blocked</span>
                                                ) : (
                                                    <span className={s.statusBadgeActive}>Active</span>
                                                )}
                                            </td>
                                            <td className={s.tdActions}>
                                                {u.role !== 'admin' ? (
                                                    <div className={s.actionsWrapper}>
                                                        <button 
                                                            onClick={() => toggleBlock(u._id, u.isBlocked)}
                                                            className={s.blockButton(u.isBlocked)}
                                                            title={u.isBlocked ? 'Unblock User' : 'Block User'}
                                                        >
                                                            {u.isBlocked ? <HiCheckCircle size={18} /> : <HiBan size={18} />}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(u._id)}
                                                            className={s.deleteButton}
                                                            title="Delete User"
                                                        >
                                                            <HiTrash size={18} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-text-muted italic">Protected</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminUserManagement;
