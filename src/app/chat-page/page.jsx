// "use client";
// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { toast } from 'react-toastify';
// import ChatSidebar from './../components/ChatSidebar';
// import ChatMain from './../components/ChatMain';
// import Navbar from '../components/Navbar';
// import { fetchChatRooms, handleChatOperation } from './../services/chat';

// const ChatPage = () => {
//     const [selectedChat, setSelectedChat] = useState(null);
//     const searchParams = useSearchParams();
//     const userId = localStorage.getItem('userId');

//     useEffect(() => {
//         // If roomID is provided in URL, set it as selected chat
//         const roomID = searchParams.get('roomID');
//         if (roomID) {
//             setSelectedChat(roomID);
//         }
//     }, [searchParams]);

//     if (!userId) {
//         return <div>Please login to access chat</div>;
//     }

//     const handleSendMessage = async (message) => {
//         try {
//             await handleChatOperation('saveChat', {
//                 roomID: selectedChat,
//                 message,
//                 sender: userId
//             });
//         } catch (error) {
//             console.error('Error sending message:', error);
//             toast.error('Failed to send message');
//         }
//     };

//     return (
//         <>
//         {/* <Navbar/> */}
//          <div className="flex h-screen bg-gray-100 p-6">
//             <div className="flex w-full max-w-7xl mx-auto space-x-6">
//                 <ChatSidebar 
//                     selectedChat={selectedChat}
//                     setSelectedChat={setSelectedChat}
//                     currentUserId={userId}
//                 />
//                 <ChatMain 
//                     selectedChat={selectedChat}
//                     currentUserId={userId}
//                     onSendMessage={handleSendMessage}
//                 />
//             </div>
//         </div>
//         </>
//     );
// };

// export default ChatPage;


"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import ChatSidebar from './../components/ChatSidebar';
import ChatMain from './../components/ChatMain';
import Navbar from '../components/Navbar';
import { fetchChatRooms, handleChatOperation } from './../services/chat';

// Separate ChatContent component that uses hooks
function ChatContent() {
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
        return <div className="flex items-center justify-center h-screen">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Required</h2>
                <p className="text-gray-600">Please login to access chat</p>
            </div>
        </div>;
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
    );
}

// Loading component
function ChatPageLoading() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#EF5744] border-t-transparent"></div>
                <p className="text-gray-600">Loading chat...</p>
            </div>
        </div>
    );
}

// Main ChatPage component with Suspense
export default function ChatPage() {
    return (
        <>
            {/* <Navbar /> */}
            <Suspense fallback={<ChatPageLoading />}>
                <ChatContent />
            </Suspense>
        </>
    );
}