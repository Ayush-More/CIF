"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../utils/withAuth';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { isAuthenticated, user } = useAuth();
    const [activeChat, setActiveChat] = useState(null);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (isAuthenticated && user) {
            // Initialize socket connection
            const socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000', {
                withCredentials: true
            });

            socketInstance.on('connect', () => {
                console.log('Connected to WebSocket server');
            });

            socketInstance.on('receive_message', (message) => {
                setMessages(prev => ({
                    ...prev,
                    [message.sender === user.userId ? message.receiver : message.sender]: [
                        ...(prev[message.sender === user.userId ? message.receiver : message.sender] || []),
                        message
                    ]
                }));
            });

            socketInstance.on('user_online', (userId) => {
                setOnlineUsers(prev => [...prev, userId]);
            });

            socketInstance.on('user_offline', (userId) => {
                setOnlineUsers(prev => prev.filter(id => id !== userId));
            });

            setSocket(socketInstance);

            // Load existing chats
            fetchChats();

            return () => {
                socketInstance.disconnect();
            };
        }
    }, [isAuthenticated, user]);

    const fetchChats = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            setChats(data.users.map(user => ({
                id: user._id,
                name: user.fullName,
                avatar: user.fullName[0],
                status: onlineUsers.includes(user._id) ? 'online' : 'offline',
                lastMessage: 'No messages yet',
                unreadCount: 0
            })));
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const sendMessage = async (receiverId, content) => {
        if (!socket || !content.trim()) return;

        try {
            const response = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiverId,
                    content: content.trim()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            socket.emit('send_message', {
                receiverId,
                content: content.trim()
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const loadMessages = async (chatId) => {
        try {
            const response = await fetch(`/api/chat/messages?userId=${chatId}`);
            const data = await response.json();
            setMessages(prev => ({
                ...prev,
                [chatId]: data.messages
            }));
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    return (
        <ChatContext.Provider value={{
            socket,
            messages,
            chats,
            activeChat,
            setActiveChat,
            sendMessage,
            loadMessages,
            onlineUsers
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);