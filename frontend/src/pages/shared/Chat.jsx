import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import API_URL from '../../config';
import Navbar from '../../components/common/Navbar';
import SellerSidebar from '../../components/seller/SellerSidebar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { io } from 'socket.io-client';
import { chatMessagesStyles as s } from '../../assets/dummyStyles';
import { HiPaperAirplane, HiUser, HiChevronLeft, HiTrash, HiChatAlt2 } from 'react-icons/hi';

const Chat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token, refreshUser } = useAuth();
    
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false); // For seller/admin sidebar
    const scrollRef = useRef();
    const socket = useRef();
    const activeChatRef = useRef();

    const searchParams = new URLSearchParams(location.search);
    const chatId = searchParams.get('id');

    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    // Socket initialization
    useEffect(() => {
        if (!user || !token) return;

        socket.current = io(API_URL.replace(/\/api$/, ''), {
            withCredentials: true
        });

        socket.current.on('connect', () => {
            console.log("Connected to socket server");
            socket.current.emit('registerUser', user._id || user.id);
        });

        socket.current.on('receiveMessage', (data) => {
            const active = activeChatRef.current;
            if (active && data.chatId === active._id) {
                setMessages(prev => {
                    // Check if message already exists
                    if (prev.some(m => m._id === data.newMessage._id)) {
                        return prev.map(m => m._id === data.newMessage._id ? data.newMessage : m);
                    }
                    return [...prev, data.newMessage];
                });
                
                // Mark received message as read if we are in this chat
                const currentUserId = user._id || user.id;
                const messageSenderId = typeof data.newMessage.sender === 'object' ? data.newMessage.sender?._id : data.newMessage.sender;
                if (messageSenderId && messageSenderId.toString() !== currentUserId.toString()) {
                    socket.current.emit('markAsRead', { chatId: active._id, userId: currentUserId });
                }
            }

            // Update preview in conversation list
            setConversations(prev => prev.map(c => {
                if (c._id === data.chatId) {
                    const alreadyHas = c.message.some(m => m._id === data.newMessage._id);
                    const updatedMsg = alreadyHas 
                        ? c.message.map(m => m._id === data.newMessage._id ? data.newMessage : m)
                        : [...c.message, data.newMessage];
                    return { ...c, message: updatedMsg, updatedAt: new Date() };
                }
                return c;
            }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        });

        socket.current.on('messagesRead', (data) => {
            const active = activeChatRef.current;
            const currentUserId = user._id || user.id;
            if (active && data.chatId === active._id) {
                setMessages(prev => prev.map(m => {
                    const senderId = typeof m.sender === 'object' ? m.sender?._id : m.sender;
                    if (senderId && senderId.toString() === currentUserId.toString()) {
                        return { ...m, status: 'read' };
                    }
                    return m;
                }));
            }
            setConversations(prev => prev.map(c => {
                if (c._id === data.chatId) {
                    const updatedMsg = c.message.map(m => {
                        const senderId = typeof m.sender === 'object' ? m.sender?._id : m.sender;
                        if (senderId && senderId.toString() === currentUserId.toString()) {
                            return { ...m, status: 'read' };
                        }
                        return m;
                    });
                    return { ...c, message: updatedMsg };
                }
                return c;
            }));
        });

        socket.current.on('messagesDelivered', (data) => {
            const active = activeChatRef.current;
            const currentUserId = user._id || user.id;
            if (active && data.chatId === active._id) {
                setMessages(prev => prev.map(m => {
                    const senderId = typeof m.sender === 'object' ? m.sender?._id : m.sender;
                    if (senderId && senderId.toString() === currentUserId.toString() && m.status === 'sent') {
                        return { ...m, status: 'delivered' };
                    }
                    return m;
                }));
            }
            setConversations(prev => prev.map(c => {
                if (c._id === data.chatId) {
                    const updatedMsg = c.message.map(m => {
                        const senderId = typeof m.sender === 'object' ? m.sender?._id : m.sender;
                        if (senderId && senderId.toString() === currentUserId.toString() && m.status === 'sent') {
                            return { ...m, status: 'delivered' };
                        }
                        return m;
                    });
                    return { ...c, message: updatedMsg };
                }
                return c;
            }));
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [user, token]);

    // Fetch all conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/chat/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setConversations(res.data || []);
                
                // If chatId in URL, find and set active chat
                if (chatId) {
                    const found = res.data.find(c => c._id === chatId);
                    if (found) {
                        fetchChatDetails(chatId);
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch conversations", err);
                setLoading(false);
            }
        };

        if (token) fetchConversations();
    }, [token, chatId]);

    const fetchChatDetails = async (id) => {
        try {
            const res = await axios.get(`${API_URL.replace(/\/$/, '')}/api/chat/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveChat(res.data);
            setMessages(res.data.message || []);
            
            if (socket.current) {
                socket.current.emit('joinChat', { chatId: id, userId: user._id || user.id });
            }
        } catch (err) {
            console.error("Failed to fetch chat details", err);
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const isOwnMessage = (msg) => {
        const senderId = typeof msg.sender === 'object' ? msg.sender?._id : msg.sender;
        const currentUserId = user?._id || user?.id;
        return senderId && currentUserId && senderId.toString() === currentUserId.toString();
    };

    const getPartner = (conv) => {
        const currentUserId = user?._id || user?.id;
        const buyerId = conv.buyer?._id || conv.buyer;
        
        if (buyerId && currentUserId && buyerId.toString() === currentUserId.toString()) {
            return conv.seller;
        }
        return conv.buyer;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const textToSend = newMessage;
        setNewMessage(''); // Clear input instantly for smooth experience

        try {
            const res = await axios.post(`${API_URL.replace(/\/$/, '')}/api/chat/send`, {
                chatId: activeChat._id,
                text: textToSend
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const msgData = {
                chatId: activeChat._id,
                newMessage: res.data.newMessage
            };

            // Optimistic update of local UI
            setMessages(prev => {
                if (prev.some(m => m._id === res.data.newMessage._id)) return prev;
                return [...prev, res.data.newMessage];
            });

            setConversations(prev => prev.map(c => 
                c._id === activeChat._id 
                ? { ...c, message: [...c.message, res.data.newMessage], updatedAt: new Date() } 
                : c
            ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));

            if (socket.current) {
                socket.current.emit('sendMessage', msgData);
            }

            if (user?.role === 'seller') {
                refreshUser();
            }
        } catch (err) {
            console.error("Failed to send message", err);
            setNewMessage(textToSend); // Restore message
            const errMsg = err.response?.data?.message || "Failed to send message";
            alert(errMsg);
        }
    };

    const handleDeleteChat = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this conversation?")) return;
        
        try {
            await axios.delete(`${API_URL.replace(/\/$/, '')}/api/chat/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(prev => prev.filter(c => c._id !== id));
            if (activeChat?._id === id) {
                setActiveChat(null);
                setMessages([]);
                navigate('/chat');
            }
        } catch (err) {
            console.error("Failed to delete chat", err);
        }
    };

    if (loading) return <div className={s.loaderFullPage}><div className={s.loader}></div></div>;

    const renderSidebar = () => {
        if (user?.role === 'seller') return <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />;
        if (user?.role === 'admin') return <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />;
        return null;
    };

    return (
        <div className={`${s.chatContainer} ${user?.role === 'buyer' ? s.chatContainerNonSeller : s.chatContainerSeller}`}>
            {user?.role === 'buyer' && <Navbar />}
            {renderSidebar()}

            <div className={`${s.chatWrapper} ${user?.role !== 'buyer' ? 'md:ml-[260px]' : ''}`}>
                {/* Conversations List */}
                <div className={`${s.sidebar} ${activeChat ? s.sidebarHidden : ''}`}>
                    <div className={s.sidebarHeader}>
                        <h2 className={s.sidebarTitle}>Messages</h2>
                    </div>
                    <div className={s.sidebarContent}>
                        {conversations.length > 0 ? (
                            conversations.map(conv => {
                                const partner = getPartner(conv);
                                const lastMsg = conv.message[conv.message.length - 1];
                                return (
                                    <div 
                                        key={conv._id} 
                                        className={`${s.conversationItem} ${activeChat?._id === conv._id ? s.conversationItemActive : ''}`}
                                        onClick={() => {
                                            navigate(`/chat?id=${conv._id}`);
                                            fetchChatDetails(conv._id);
                                        }}
                                    >
                                        <div className={s.avatar}>
                                            {partner?.profilePic ? (
                                                <img src={partner.profilePic} className={s.avatarImg} alt={partner.name} />
                                            ) : (
                                                <HiUser />
                                            )}
                                        </div>
                                        <div className={s.conversationInfo}>
                                            <p className={s.conversationName}>{partner?.name || 'User'}</p>
                                            <p className={s.conversationPreview}>
                                                {lastMsg ? lastMsg.text : 'No messages yet'}
                                            </p>
                                        </div>
                                        <button 
                                            className={s.deleteChatButton}
                                            onClick={(e) => handleDeleteChat(e, conv._id)}
                                        >
                                            <HiTrash size={16} />
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className={s.emptyConversations}>
                                <HiChatAlt2 className={s.emptyIcon} />
                                <p>No conversations yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`${s.chatArea} ${!activeChat ? 'hidden lg:flex' : 'flex'}`}>
                    {activeChat ? (
                        <>
                            <div className={s.chatHeader}>
                                <div className={s.chatHeaderLeft}>
                                    <button className={s.backButton} onClick={() => setActiveChat(null)}>
                                        <HiChevronLeft size={24} />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary overflow-hidden">
                                        {activeChat.partner?.profilePic ? (
                                            <img src={activeChat.partner.profilePic} className="w-full h-full object-cover" />
                                        ) : (
                                            <HiUser size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <p className={s.chatPartnerName}>{activeChat.partner?.name}</p>
                                        <p className="text-[10px] text-green-500 font-bold uppercase">Online</p>
                                    </div>
                                </div>
                                {activeChat.property && (
                                    <div className="hidden sm:flex items-center gap-2 bg-bg-alt p-2 rounded-xl border border-border">
                                        <img src={activeChat.property.images?.[0]} className="w-8 h-8 rounded-lg object-cover" />
                                        <div className="text-[10px]">
                                            <p className="font-bold text-text-main line-clamp-1">{activeChat.property.title}</p>
                                            <p className="text-primary font-bold">₹{activeChat.property.price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={s.messagesArea}>
                                {messages.map((msg, idx) => {
                                    const own = isOwnMessage(msg);
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`${s.messageBubble} ${own ? s.messageOwn : s.messageOther}`}
                                        >
                                            <div className={s.messageContent}>
                                                <span className={s.messageText}>{msg.text}</span>
                                            </div>
                                            <span className={s.messageTime}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {own && (
                                                    <span className="ml-1 text-[10px] font-bold">
                                                        {msg.status === 'read' ? (
                                                            <span className="text-blue-200">✓✓</span>
                                                        ) : msg.status === 'delivered' ? (
                                                            <span className="text-gray-300">✓✓</span>
                                                        ) : (
                                                            <span className="text-gray-300">✓</span>
                                                        )}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div ref={scrollRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className={s.messageForm}>
                                <input 
                                    type="text" 
                                    className={s.messageInput}
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className={s.sendButton}>
                                    <HiPaperAirplane className={s.sendIcon} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className={s.noChatSelected}>
                            <HiChatAlt2 className={s.noChatIcon} />
                            <p className={s.noChatTitle}>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
