import React, { useEffect, useState } from 'react';
import { adminLayoutStyles as ls, adminDashboardStyles as ds } from '../../assets/dummyStyles';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { HiTrash, HiEye, HiChatAlt2, HiSearch, HiX, HiUser, HiHome, HiClock } from 'react-icons/hi';

const AdminChatManagement = () => {
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Conversation Modal State
    const [selectedChat, setSelectedChat] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { token } = useAuth();

    const fetchChats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/admin/chats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChats(res.data.chats || []);
            setFilteredChats(res.data.chats || []);
        } catch (error) {
            console.error("Failed to fetch chats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    // Filter chats based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredChats(chats);
            return;
        }
        const query = searchQuery.toLowerCase();
        const filtered = chats.filter(c => {
            const buyerName = c.buyer?.name?.toLowerCase() || '';
            const buyerEmail = c.buyer?.email?.toLowerCase() || '';
            const sellerName = c.seller?.name?.toLowerCase() || '';
            const sellerEmail = c.seller?.email?.toLowerCase() || '';
            const propTitle = c.property?.title?.toLowerCase() || '';
            return buyerName.includes(query) || 
                   buyerEmail.includes(query) || 
                   sellerName.includes(query) || 
                   sellerEmail.includes(query) ||
                   propTitle.includes(query);
        });
        setFilteredChats(filtered);
    }, [searchQuery, chats]);

    const handleDeleteChat = async (id) => {
        if (!window.confirm("Are you sure you want to delete this chat conversation? This will delete all messages inside it!")) return;
        try {
            await axios.delete(`${API_URL.replace(/\/$/, '')}/api/admin/chats/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChats(prev => prev.filter(c => c._id !== id));
            if (selectedChat?._id === id) {
                setIsModalOpen(false);
                setSelectedChat(null);
            }
        } catch (error) {
            console.error("Failed to delete chat", error);
        }
    };

    const handleViewChat = (chat) => {
        setSelectedChat(chat);
        setIsModalOpen(true);
    };

    if (loading) return <div className={ds.loaderFullPage}><div className={ds.loader}></div></div>;

    return (
        <div className={ls.layout}>
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={ls.mainWrapper}>
                <main className={ls.mainContent}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 flex-wrap gap-6 text-left">
                        <div>
                            <h1 className={ds.pageTitle}>Chat Management</h1>
                            <p className={ds.pageSubtitle}>Monitor and review buyer-seller conversations on the platform</p>
                        </div>
                        <div className="relative w-full max-w-xs sm:max-w-sm mt-2 sm:mt-0">
                            <HiSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input 
                                type="text"
                                placeholder="Search by user, email, or property..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-white text-sm outline-none focus:border-primary shadow-sm transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Chat Conversation Table */}
                    <div className="card-premium overflow-hidden mb-8 p-0">
                        <div className="overflow-x-auto touch-pan-x">
                            <table className="w-full border-collapse min-w-[900px] text-left">
                                <thead className="bg-[#f8fafc] text-text-muted text-[0.7rem] font-bold uppercase tracking-[0.05em]">
                                    <tr>
                                        <th className="py-4 px-6">Property / Room</th>
                                        <th className="py-4 px-6">Buyer Details</th>
                                        <th className="py-4 px-6">Seller Details</th>
                                        <th className="py-4 px-6 text-center">Messages</th>
                                        <th className="py-4 px-6">Last Message</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredChats.length > 0 ? (
                                        filteredChats.map(chat => {
                                            const lastMsg = chat.message?.[chat.message.length - 1];
                                            return (
                                                <tr key={chat._id} className="hover:bg-gray-50/50 transition-colors">
                                                    {/* Property Column */}
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                                                                <HiHome size={20} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-[0.9375rem] text-text-main truncate max-w-[200px]">
                                                                    {chat.property?.title || "General Chat"}
                                                                </p>
                                                                {chat.property?.price && (
                                                                    <p className="text-[0.75rem] text-primary font-bold">
                                                                        ${chat.property.price.toLocaleString()}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Buyer Column */}
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm overflow-hidden">
                                                                {chat.buyer?.profilePic ? (
                                                                    <img src={chat.buyer.profilePic} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <HiUser size={18} />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-sm truncate max-w-[150px]">{chat.buyer?.name || "Deleted User"}</p>
                                                                <p className="text-xs text-text-muted truncate max-w-[150px]">{chat.buyer?.email || ""}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Seller Column */}
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 font-bold text-sm overflow-hidden">
                                                                {chat.seller?.profilePic ? (
                                                                    <img src={chat.seller.profilePic} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <HiUser size={18} />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-sm truncate max-w-[150px]">{chat.seller?.name || "Deleted User"}</p>
                                                                <p className="text-xs text-text-muted truncate max-w-[150px]">{chat.seller?.email || ""}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Total Message Count */}
                                                    <td className="py-5 px-6 text-center font-bold text-sm text-text-main">
                                                        {chat.message?.length || 0}
                                                    </td>

                                                    {/* Last Message snippet */}
                                                    <td className="py-5 px-6">
                                                        {lastMsg ? (
                                                            <div className="min-w-0">
                                                                <p className="text-xs text-text-main truncate max-w-[200px] italic">
                                                                    "{lastMsg.text}"
                                                                </p>
                                                                <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                                                                    <HiClock /> {new Date(lastMsg.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-text-muted italic">No messages</span>
                                                        )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="py-5 px-6 text-right">
                                                        <div className="flex justify-end gap-2.5">
                                                            <button 
                                                                onClick={() => handleViewChat(chat)}
                                                                className="w-9 h-9 rounded-lg border border-border bg-white text-blue-600 flex items-center justify-center hover:bg-blue-50 cursor-pointer transition-colors"
                                                                title="View Full Conversation"
                                                            >
                                                                <HiEye size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteChat(chat._id)}
                                                                className="w-9 h-9 rounded-lg border-none bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 cursor-pointer transition-colors"
                                                                title="Delete Conversation"
                                                            >
                                                                <HiTrash size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-16 text-center text-text-muted">
                                                <HiChatAlt2 size={48} className="mx-auto opacity-20 mb-4" />
                                                <p>No chat conversations found.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Conversation History Modal */}
            {isModalOpen && selectedChat && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1100] p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative animate-scale-up">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-border flex justify-between items-center bg-bg-alt">
                            <div>
                                <h3 className="font-bold text-lg text-text-main">Conversation Transcript</h3>
                                <p className="text-xs text-text-muted">
                                    Buyer: <span className="font-semibold text-text-main">{selectedChat.buyer?.name}</span> | 
                                    Seller: <span className="font-semibold text-text-main">{selectedChat.seller?.name}</span>
                                </p>
                            </div>
                            <button 
                                onClick={() => { setIsModalOpen(false); setSelectedChat(null); }}
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors text-text-muted hover:text-text-main"
                            >
                                <HiX size={20} />
                            </button>
                        </div>

                        {/* Modal Message History */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-4">
                            {selectedChat.message && selectedChat.message.length > 0 ? (
                                selectedChat.message.map((msg) => {
                                    const isBuyer = msg.sender === selectedChat.buyer?._id;
                                    const senderName = isBuyer ? selectedChat.buyer?.name : selectedChat.seller?.name;
                                    
                                    return (
                                        <div 
                                            key={msg._id} 
                                            className={`flex flex-col max-w-[80%] ${isBuyer ? 'self-start items-start' : 'self-end items-end'}`}
                                        >
                                            <span className="text-[10px] text-text-muted font-bold mb-1 px-1 uppercase tracking-wider">
                                                {isBuyer ? "Buyer" : "Seller"} • {senderName}
                                            </span>
                                            <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                                                isBuyer 
                                                    ? 'bg-white text-text-main rounded-tl-none border border-border' 
                                                    : 'bg-primary text-white rounded-tr-none'
                                            }`}>
                                                {msg.image && (
                                                    <div className="mb-2 rounded-lg overflow-hidden max-w-xs">
                                                        <img src={msg.image} className="w-full max-h-48 object-cover" alt="Chat attachment" />
                                                    </div>
                                                )}
                                                <p className="leading-relaxed break-words">{msg.text}</p>
                                                <span className={`text-[9px] block mt-2 text-right ${isBuyer ? 'text-text-muted' : 'text-white/80'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-16 text-center text-text-muted">
                                    <p className="italic">No messages exchange recorded in this chat.</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-border bg-[#f8fafc] flex justify-between items-center">
                            <span className="text-xs text-text-muted">Chat ID: {selectedChat._id}</span>
                            <button 
                                onClick={() => handleDeleteChat(selectedChat._id)}
                                className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1.5"
                            >
                                <HiTrash size={14} /> Delete Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminChatManagement;
