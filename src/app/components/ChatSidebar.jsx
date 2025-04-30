// import React, { useState } from 'react';

// const ChatSidebar = ({ selectedChat, setSelectedChat }) => {
//   const [searchQuery, setSearchQuery] = useState('');
  
//   const chats = [
//     { id: 1, name: 'Admin', lastMessage: 'No Message', avatar: 'A', status: 'online', time: '12:30 PM' },
//     { id: 2, name: 'Ayush', lastMessage: 'No Message', avatar: 'A', status: 'offline', time: 'Yesterday' },
//     { id: 3, name: 'First Group', lastMessage: 'No Message', avatar: 'F', status: 'online', time: '2:45 PM', isGroup: true },
//     { id: 4, name: 'Hello', lastMessage: 'No Message', avatar: 'H', status: 'away', time: '9:00 AM' },
//     { id: 5, name: 'Second Group', lastMessage: 'No Message', avatar: 'S', status: 'online', time: '11:20 AM', isGroup: true },
//   ];

//   return (
//     <div className="w-96 bg-white rounded-2xl shadow-2xl flex flex-col">
//       {/* Header */}
//       <div className="p-6 border-b border-gray-100">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
//           <div className="flex space-x-2">
//             <button className="p-2 hover:bg-blue-50 rounded-xl transition-colors duration-200">
//               <svg className="w-6 h-6 text-[#EF5744]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             </button>
//             <button className="p-2 hover:bg-blue-50 rounded-xl transition-colors duration-200">
//               <svg className="w-6 h-6 text-[#EF5744]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//               </svg>
//             </button>
//           </div>
//         </div>
        
//         {/* Search */}
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search messages..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-5 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-600 placeholder-gray-400"
//           />
//           <svg
//             className="w-5 h-5 absolute right-4 top-3.5 text-gray-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>
//       </div>

//       {/* Chat List */}
//       <div className="overflow-y-auto flex-1 py-2">
//         {chats.map((chat) => (
//           <div
//             key={chat.id}
//             className={`mx-3 mb-2 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
//               selectedChat === chat.id
//                 ? 'bg-blue-50 border-blue-100'
//                 : 'hover:bg-gray-50'
//             }`}
//             onClick={() => setSelectedChat(chat.id)}
//           >
//             <div className="flex items-center">
//               <div className="relative">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF5744] to-[#EF5744] flex items-center justify-center text-white font-semibold text-lg shadow-md">
//                   {chat.avatar}
//                 </div>
//                 <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
//                   chat.status === 'online' ? 'bg-green-500' :
//                   chat.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
//                 }`} />
//               </div>
//               <div className="ml-4 flex-1">
//                 <div className="flex items-center justify-between">
//                   <h3 className="font-semibold text-gray-800">{chat.name}</h3>
//                   <span className="text-xs text-gray-500">{chat.time}</span>
//                 </div>
//                 <div className="flex items-center mt-1">
//                   <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
//                   {chat.unreadCount && (
//                     <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
//                       {chat.unreadCount}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChatSidebar;

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
        return messages.length > 0 ? messages[messages.length - 1].message : 'No messages';
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
                                            className="w-12 h-12 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF5744] to-[#EF5744] flex items-center justify-center text-white font-semibold text-lg">
                                            {otherUser.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-800">{otherUser.name || "User" }</h3>
                                        <span className="text-xs text-gray-500">
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