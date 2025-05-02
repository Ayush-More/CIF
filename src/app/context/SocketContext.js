// "use client";
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const SocketContext = createContext();

// export function SocketProvider({ children }) {
//     const [socket, setSocket] = useState(null);
//     const [isConnected, setIsConnected] = useState(false);

//     useEffect(() => {
//         // Initialize socket connection
//         const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

//         socketInstance.on('connect', () => {
//             console.log('Connected to Socket.IO server');
//             setIsConnected(true);
//         });

//         socketInstance.on('disconnect', () => {
//             console.log('Disconnected from Socket.IO server');
//             setIsConnected(false);
//         });

//         setSocket(socketInstance);

//         // Cleanup on unmount
//         return () => {
//             socketInstance.disconnect();
//         };
//     }, []);

//     return (
//         <SocketContext.Provider value={{ socket, isConnected }}>
//             {children}
//         </SocketContext.Provider>
//     );
// }

// export const useSocket = () => useContext(SocketContext);

"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'https://careforindiansv2.vercel.app', {
            path: '/api/socketio',
            addTrailingSlash: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketInstance.on('connect', () => {
            console.log('Connected to Socket.IO');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from Socket.IO');
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        setSocket(socketInstance);

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