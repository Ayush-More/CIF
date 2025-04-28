import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const ChatSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { chats, activeChat, setActiveChat, loadMessages, onlineUsers } = useChat();
  console.log(chats);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat);
    }
  }, [activeChat]);

  return (
    <div className="w-96 bg-white rounded-2xl shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-blue-50 rounded-xl transition-colors duration-200">
              <svg className="w-6 h-6 text-[#EF5744]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-600 placeholder-gray-400"
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
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`mx-3 mb-2 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              activeChat === chat.id
                ? 'bg-blue-50 border-blue-100'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveChat(chat.id)}
          >
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF5744] to-[#EF5744] flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {chat.avatar}
                </div>
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  onlineUsers.includes(chat.id) ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                </div>
                <div className="flex items-center mt-1">
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;