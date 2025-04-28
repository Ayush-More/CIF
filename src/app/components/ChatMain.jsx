import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const ChatMain = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { activeChat, messages, sendMessage, chats } = useChat();
  
  const activeUser = chats.find(chat => chat.id === activeChat);
  const chatMessages = messages[activeChat] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    await sendMessage(activeChat, message);
    setMessage('');
  };

  if (!activeChat) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-blue-50 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-16 h-16 text-[#EF5744]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Chat</h3>
          <p className="text-gray-500">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-2xl">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF5744] to-[#EF5744] flex items-center justify-center text-white font-semibold text-lg">
                {activeUser?.avatar}
              </div>
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white ${
                activeUser?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800">{activeUser?.name}</h2>
              <p className="text-sm text-green-500">{activeUser?.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-6">
          {chatMessages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender === activeChat ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[70%] ${msg.sender === activeChat ? 'bg-white' : 'bg-[#EF5744] text-white'} rounded-2xl px-6 py-4 shadow-md`}>
                <p className="text-sm">{msg.content}</p>
                <span className={`text-xs mt-2 block ${msg.sender === activeChat ? 'text-gray-400' : 'text-blue-100'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-6 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <button
            type="submit"
            className="p-3 bg-[#EF5744] text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatMain;