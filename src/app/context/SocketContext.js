"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
    if (socket && userId) {
        // Emit user_connected event when socket connects
        socket.emit('user_connected', userId);
    }
}, [socket, userId]);

    useEffect(() => {
        // Initialize socket connection
        const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

        socketInstance.on('connect', () => {
            console.log('Connected to Socket.IO server');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
            setIsConnected(false);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);