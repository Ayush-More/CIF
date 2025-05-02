"use client";
import React, { useState, useEffect } from 'react';
import { fetchChatRooms } from './../services/chat';

const ChatSidebar = ({ selectedChat, setSelectedChat, currentUserId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadChatRooms = async () => {
            try {
                const rooms = await fetchChatRooms(currentUserId);
                setChatRooms(rooms);
            } catch (error) {
                console.error('Error loading chat rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        loadChatRooms();
    }, [currentUserId]);

    const getOtherUser = (room) => {
        return room.usersWithProfiles.find(user => user.user_id !== currentUserId);
    };

    const getLastMessage = (room) => {
        const messages = room.messages;
        if (messages.length === 0) return 'No messages';
        
        const lastMessage = messages[messages.length - 1].message;
        
        // Try to parse if it's a meeting message
        try {
            const parsedMessage = JSON.parse(lastMessage);
            if (parsedMessage.type === 'meeting') {
                return '📅 Meeting Invitation';
            }
        } catch (e) {
            // Not a JSON message, continue with normal text
        }
        
        // Truncate message if it's longer than 30 characters
        const MAX_LENGTH = 30;
        if (lastMessage.length > MAX_LENGTH) {
            return lastMessage.substring(0, MAX_LENGTH) + '...';
        }
        
        return lastMessage;
    };

    const formatTime = (date) => {
        const now = new Date();
        const messageDate = new Date(date);
        
        if (messageDate.toDateString() === now.toDateString()) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return messageDate.toLocaleDateString();
        }
    };

    const filteredChats = chatRooms.filter(room => {
        const otherUser = getOtherUser(room);
        return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading) {
        return <div className="w-96 bg-white rounded-2xl shadow-2xl p-6">Loading chats...</div>;
    }

    return (
        <div className="w-96 bg-white rounded-2xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                </div>
                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full py-2 pl-4 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:border-[#EF5744]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg
                        className="w-5 h-5 absolute right-4 top-3.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto flex-1 py-2">
                {filteredChats.map((room) => {
                    const otherUser = getOtherUser(room);
                    if (!otherUser) return null;

                    return (
                        <div
                            key={room._id}
                            className={`mx-3 mb-2 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedChat === room._id
                                    ? 'bg-blue-50 border-blue-100'
                                    : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedChat(room._id)}
                        >
                            <div className="flex items-center">
                                <div className="relative">
                                    {otherUser.profilePic ? (
                                        <img 
                                            src={otherUser.profilePic} 
                                            alt={otherUser.name} 
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF5744] to-[#EF5744] flex items-center justify-center text-white font-semibold text-lg">
                                            {otherUser.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 flex-1 min-w-0"> {/* Added min-w-0 to enable truncation */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-800 truncate">{otherUser.name || "User"}</h3>
                                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                            {formatTime(room.updatedAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <p className="text-sm text-gray-500 truncate">
                                            {getLastMessage(room)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChatSidebar;