'use client'
import React, { useState } from 'react';
import { ChatProvider } from './../context/ChatContext';
import ChatSidebar from './../components/ChatSidebar';
import ChatMain from './../components/ChatMain';
import Navbar from '../components/Navbar';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <ChatProvider>
       <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar/>
      <div className="flex mt-20 w-full h-[85%] max-w-7xl mx-auto p-4 gap-4">
        <ChatSidebar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        <ChatMain selectedChat={selectedChat} />
      </div>
    </div>
    </ChatProvider>
  );
};

export default ChatPage;