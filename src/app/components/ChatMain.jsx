"use client";
import React, { useState, useEffect, useRef } from 'react';
import { fetchChatRooms, handleChatOperation , fetchChatProfile } from './../services/chat';
import MeetingDialog from './MeetingDialog';
import ProfileDialog from './ProfileDialog';
import MeetingMessage from "./MeetingMessage";
import { useSocket } from './../context/SocketContext';

const ChatMain = ({ selectedChat, currentUserId }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatInfo, setChatInfo] = useState(null);
    const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [chatProfile, setChatProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const messagesEndRef = useRef(null);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const typingTimeoutRef = useRef(null);
    const { socket, isConnected } = useSocket();

    const fetchProfile = async (userId) => {
        if (!userId) return;
        
        setLoadingProfile(true);
        try {
            const profileData = await fetchChatProfile(userId);
            setChatProfile(profileData);
        } catch (error) {
            toast.error('Failed to load user profile');
            console.error('Error fetching profile:', error);
        } finally {
            setLoadingProfile(false);
        }
    };

const handleMeetingCreated = async (meetingData) => {
    if (!socket || !isConnected || !selectedChat) {
        toast.error('Connection issue. Please try again.');
        return;
    }

    try {
        // Create the meeting message object
        const meetingMessage = {
            type: 'meeting',
            data: {
                title: meetingData.title,
                scheduledDate: meetingData.scheduledDate,
                joinUrl: meetingData.joinUrl,
                timezone: meetingData.timezone
            }
        };

        // First save to database
        const result = await handleChatOperation('saveChat', {
            roomID: selectedChat,
            message: JSON.stringify(meetingMessage),
            sender: currentUserId
        });

        // Then create a properly structured message object
        const newMessage = {
            id: Date.now().toString(),
            message: JSON.stringify(meetingMessage),
            sender: currentUserId,
            created_at: new Date().toISOString(),
            sender_name: localStorage.getItem('username')
        };
     
            socket.emit('send_message', {
                roomId: selectedChat,
                message: JSON.stringify(meetingMessage),
                sender: currentUserId,
                sender_name: localStorage.getItem('username'),
                type: 'meeting'
            });
    } catch (error) {
        console.error('Error sending meeting message:', error);
        toast.error('Failed to send meeting invitation');
    }
};
const handleInputChange = (e) => {
    setMessage(e.target.value);
};
    const renderMessage = (msg) => {
        const isUserMessage = msg.sender === currentUserId;

        try {
            // Check if the message is a string and try to parse it
            if (typeof msg.message === 'string') {
                let messageContent;
                try {
                    messageContent = JSON.parse(msg.message);
                } catch (e) {
                    // If parsing fails, it's a regular message
                    messageContent = null;
                }

                // If it's a meeting message
                if (messageContent?.type === 'meeting') {
                    return (
                        <MeetingMessage
                            key={msg.id}
                            meeting={messageContent.data}
                            isUserMessage={isUserMessage}
                        />
                    );
                }
            }

            // Regular text message
            return (
                <div
                    key={msg.id}
                    className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}
                >
                    {!isUserMessage && (
                        <div className="flex-shrink-0 mr-3">
                            <div className="w-8 h-8 rounded-full bg-[#EF5744] flex items-center justify-center text-white text-sm font-medium">
                                {msg.sender_name?.charAt(0) || 'A'}
                            </div>
                        </div>
                    )}
                    {/* <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isUserMessage
                                ? 'bg-[#EF5744] text-white'
                                : 'bg-white border border-gray-200'
                        }`}
                    >
                        <p className="text-sm">{msg.message}</p>
                        <span
                            className={`text-xs mt-1 block ${
                                isUserMessage ? 'text-white/80' : 'text-gray-400'
                            }`}
                        >
                            {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div> */}
                    <div
                        className={`max-w-[40%] rounded-2xl px-2 py-2 ${
                            isUserMessage
                                ? 'bg-[#EF5744] text-white'
                                : 'bg-white border border-gray-200'
                        }`}
                        style={{ wordWrap: 'break-word' }}
                    >
                        <p className="text-sm whitespace-pre-wrap break-words" style={{ maxWidth: '100%' }}>
                            {msg.message}
                        </p>
                        <span
                            className={`text-xs mt-1 block ${
                                isUserMessage ? 'text-white/80' : 'text-gray-400'
                            }`}
                        >
                            {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            );
        } catch (error) {
            console.error('Error rendering message:', error);
            return null;
        }
    };

    // Scroll to bottom when messages update
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (socket && selectedChat) {
            // Join chat room
            socket.emit('join_room', selectedChat);

            // Listen for new messages
            // const handleNewMessage = (message) => {
            //     setMessages(prev => [...prev, message]);
            // };

            const handleNewMessage = (message) => {
                setMessages(prev => [...prev, message]);
                // Only show toast for messages from other users
                if (message.sender !== currentUserId) {
                    try {
                        // Try to parse the message to check if it's a meeting message
                        const parsedMessage = JSON.parse(message.message);
                        if (parsedMessage.type === 'meeting') {
                            toast.info(`${message.sender_name} sent a meeting invitation`, {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                        } else {
                            // Regular message toast
                            toast.info(`${message.sender_name}: ${message.message.length > 50 
                                ? message.message.substring(0, 50) + '...' 
                                : message.message}`, {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                        }
                    } catch (e) {
                        // If parsing fails, it's a regular message
                        toast.info(`${message.sender_name}: ${message.message.length > 50 
                            ? message.message.substring(0, 50) + '...' 
                            : message.message}`, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    }
                }
            };

            // Listen for typing indicators
            const handleTyping = ({ userId, username }) => {
                if (userId !== currentUserId) {
                    setTypingUsers(prev => new Set([...prev, username]));
                }
            };

            const handleStopTyping = ({ userId }) => {
                if (userId !== currentUserId) {
                    setTypingUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(userId);
                        return newSet;
                    });
                }
            };

            // Add event listeners
            socket.on('receive_message', handleNewMessage);
            socket.on('user_typing', handleTyping);
            socket.on('user_stop_typing', handleStopTyping);

            // Cleanup
            return () => {
                socket.emit('leave_room', selectedChat);
                socket.off('receive_message', handleNewMessage);
                socket.off('user_typing', handleTyping);
                socket.off('user_stop_typing', handleStopTyping);
            };
        }
    }, [socket, selectedChat, currentUserId]);



    const handleProfileClick = async () => {
        if (!chatInfo?.otherUser?.user_id) {
            toast.error('User information not available');
            return;
        }

        if (!chatProfile) {
            await fetchProfile(chatInfo.otherUser.user_id);
        }
        setIsProfileDialogOpen(true);
    };

    // Add this with your other refs at the top of the component
    const textareaRef = useRef(null);

    // Add this function after your other functions
    const autoResizeTextarea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 44), 120)}px`;
        }
    };

    // Add this useEffect hook
    useEffect(() => {
        autoResizeTextarea();
    }, [message]);

    // Fetch chat room details and messages
    useEffect(() => {
        const fetchChatDetails = async () => {
            if (!selectedChat || !currentUserId) return;
            
            setLoading(true);
            try {
                const rooms = await fetchChatRooms(currentUserId);
                // Find the selected chat room
                const currentRoom = rooms.find(room => room._id === selectedChat);
                if (currentRoom) {
                    // Get the other user's info
                    const otherUser = currentRoom.usersWithProfiles.find(
                        user => user.user_id !== currentUserId
                    );
                    setChatInfo({
                        otherUser,
                        messages: currentRoom.messages || []
                    });
                    setMessages(currentRoom.messages || []);
                }
            } catch (error) {
                console.error('Error fetching chat details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatDetails();
    }, [selectedChat, currentUserId]);

    // const handleSendMessage = async (e) => {
    //     e.preventDefault();
    //     if (!message.trim() || !socket || !isConnected || !selectedChat) return;

    //     try {
    //         const result = await handleChatOperation('saveChat', {
    //             roomID: selectedChat,
    //             message: message.trim(),
    //             sender: currentUserId
    //         });

    //         if (result) {
    //             // Add new message to the list
    //             const newMessage = {
    //                 id: result.id,
    //                 message: message.trim(),
    //                 sender: currentUserId,
    //                 created_at: new Date().toISOString(), // Ensure proper date format
    //                 status: 0
    //             };
    //             setMessages(prevMessages => [...prevMessages, newMessage]);
    //             setMessage('');
    //         }
    //         // Send message through socket
    //         socket.emit('send_message', {
    //             roomId: selectedChat,
    //             message: message.trim(),
    //             sender: currentUserId,
    //             sender_name: localStorage.getItem('username')
    //         });

    //         // Clear input and typing status
    //         setInputMessage('');
    //         setIsTyping(false);
    //         if (typingTimeoutRef.current) {
    //             clearTimeout(typingTimeoutRef.current);
    //         }
    //     } catch (error) {
    //         console.error('Error sending message:', error);
    //         toast.error('Failed to send message');
    //     }
    // };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !socket || !isConnected || !selectedChat) return;
    
        try {
            const formattedMessage = message.trim();
            const result = await handleChatOperation('saveChat', {
                roomID: selectedChat,
                message: formattedMessage,
                sender: currentUserId
            });
    
            if (result) {
                // Add new message to the list
                const newMessage = {
                    id: result.id,
                    message: formattedMessage,
                    sender: currentUserId,
                    created_at: new Date().toISOString(),
                    sender_name: localStorage.getItem('username'),
                    status: 0
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);
                 // Clear the input field
                 setMessage('');
                    
                    // Reset textarea height
                    if (textareaRef.current) {
                        textareaRef.current.style.height = '44px';
                        // Force the textarea to reset its value
                        textareaRef.current.value = '';
                    }
                    }
            
            // Send message through socket
            socket.emit('send_message', {
                roomId: selectedChat,
                message: formattedMessage,
                sender: currentUserId,
                sender_name: localStorage.getItem('username')
            });
            setMessage('');
    
            // Clear input and typing status
    
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };


    if (!selectedChat) {
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
        <>
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-2xl">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div onClick={handleProfileClick}  className="flex cursor-pointer items-center">
                        <div  className="relative">
                            {chatInfo?.otherUser?.profilePic ? (
                                <img 
                                    src={chatInfo.otherUser.profilePic} 
                                    alt={chatInfo.otherUser.name}
                                    className="w-12 h-12 rounded-full"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF5744] to-[#EF5744] flex items-center justify-center text-white font-semibold text-lg">
                                    {chatInfo?.otherUser?.name?.charAt(0) || 'U'}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {chatInfo?.otherUser?.name || 'User'}
                            </h2>
                            <p className="text-sm text-green-500">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </button> */}
                        <button  onClick={() => { console.log('Video button clicked');setIsMeetingDialogOpen(true)}}  className="p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto py-6 px-1 bg-gray-50">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <p>Loading messages...</p>
                    </div>
                ) : (
                    // <div className="space-y-6">
                    //     {messages.map(renderMessage)}
                    //     <div ref={messagesEndRef} />
                    // </div>
                    <div className="space-y-6 px-4">
                        {messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="p-6 bg-white border-t border-gray-100">
                <div className="flex items-center space-x-4">
                    {/* <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button> */}
                    {/* <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-6 py-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF5744] transition-all duration-200"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    /> */}
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Type your message..."
                        rows="1"
                        className="flex-1 px-6 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF5744] transition-all duration-200 resize-none min-h-[44px] max-h-[120px] overflow-y-auto"
                    />

                    <button 
                        onClick={handleSendMessage}
                        className="p-3 bg-[#EF5744] text-white rounded-xl hover:bg-[#ef5744dd] transition-colors duration-200 flex items-center justify-center"
                    >
                        <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <MeetingDialog 
        isOpen={isMeetingDialogOpen}
        closeDialog={() => setIsMeetingDialogOpen(false)}
        onMeetingCreated={handleMeetingCreated}
    />
    {/* Add the ProfileDialog component */}
    <ProfileDialog
                isOpen={isProfileDialogOpen}
                closeDialog={() => setIsProfileDialogOpen(false)}
                profileData={chatProfile}
                isLoading={loadingProfile}
            />
    </>
    );
};

export default ChatMain;