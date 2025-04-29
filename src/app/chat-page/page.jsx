// 'use client'
// import React, { useState } from 'react';
// import ChatSidebar from './../components/ChatSidebar';
// import ChatMain from './../components/ChatMain';
// import Navbar from '../components/Navbar';

// const ChatPage = () => {
//   const [selectedChat, setSelectedChat] = useState(null);

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Navbar/>
//       <div className="flex mt-20 w-full h-[85%] max-w-7xl mx-auto p-4 gap-4">
//         <ChatSidebar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
//         <ChatMain selectedChat={selectedChat} />
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import ChatSidebar from './../components/ChatSidebar';
import ChatMain from './../components/ChatMain';
import Navbar from '../components/Navbar';
import { fetchChatRooms, handleChatOperation } from './../services/chat';

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const searchParams = useSearchParams();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        // If roomID is provided in URL, set it as selected chat
        const roomID = searchParams.get('roomID');
        if (roomID) {
            setSelectedChat(roomID);
        }
    }, [searchParams]);

    if (!userId) {
        return <div>Please login to access chat</div>;
    }

    const handleSendMessage = async (message) => {
        try {
            await handleChatOperation('saveChat', {
                roomID: selectedChat,
                message,
                sender: userId
            });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    return (
        <>
        {/* <Navbar/> */}
         <div className="flex h-screen bg-gray-100 p-6">
            <div className="flex w-full max-w-7xl mx-auto space-x-6">
                <ChatSidebar 
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    currentUserId={userId}
                />
                <ChatMain 
                    selectedChat={selectedChat}
                    currentUserId={userId}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
        </>
    );
};

export default ChatPage;