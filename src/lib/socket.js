// const { Server } = require('socket.io');

// function initSocket(httpServer) {
//     const io = new Server(httpServer, {
//         cors: {
//             origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
//             methods: ["GET", "POST"]
//         }
//     });

//     io.on('connection', (socket) => {
//         console.log('User connected:', socket.id);

//         socket.on('join_room', (roomId) => {
//             socket.join(roomId);
//             console.log(`User ${socket.id} joined room ${roomId}`);
//         });

//         socket.on('leave_room', (roomId) => {
//             socket.leave(roomId);
//             console.log(`User ${socket.id} left room ${roomId}`);
//         });

//         socket.on('send_message', (data) => {
//             // Handle different message types
//             const messageData = {
//                 id: Date.now().toString(),
//                 message: data.message,
//                 sender: data.sender,
//                 created_at: new Date().toISOString(),
//                 sender_name: data.sender_name,
//                 type: data.type || 'text' // Add message type
//             };

//             // If it's a meeting message, add meeting data
//             if (data.type === 'meeting') {
//                 try {
//                     const meetingData = typeof data.message === 'string' 
//                         ? JSON.parse(data.message) 
//                         : data.message;
                        
//                     messageData.meetingData = {
//                         title: meetingData.data.title,
//                         scheduledDate: meetingData.data.scheduledDate,
//                         joinUrl: meetingData.data.joinUrl,
//                         timezone: meetingData.data.timezone
//                     };
//                 } catch (error) {
//                     console.error('Error parsing meeting data:', error);
//                 }
//             }

//             io.to(data.roomId).emit('receive_message', messageData);
//         });

//         socket.on('typing', (data) => {
//             socket.to(data.roomId).emit('user_typing', {
//                 userId: data.userId,
//                 username: data.username
//             });
//         });

//         socket.on('stop_typing', (data) => {
//             socket.to(data.roomId).emit('user_stop_typing', {
//                 userId: data.userId
//             });
//         });

//         socket.on('disconnect', () => {
//             console.log('User disconnected:', socket.id);
//         });
//     });

//     return io;
// }

// module.exports = { initSocket };

const { Server } = require('socket.io');

function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    // Map to store user connections: userId -> socket.id
    const connectedUsers = new Map();

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Handle user authentication and store connection
        socket.on('user_connected', (userId) => {
            if (userId) {
                connectedUsers.set(userId, socket.id);
                // Broadcast to all clients that this user is now online
                io.emit('user_connected', { userId });
                console.log(`User ${userId} connected and stored with socket ${socket.id}`);
            }
        });

        // Handle status check requests
        socket.on('check_user_status', (userId) => {
            const isOnline = connectedUsers.has(userId);
            socket.emit('user_status', {
                userId,
                status: isOnline ? 'online' : 'offline'
            });
            console.log(`Status check for user ${userId}: ${isOnline ? 'online' : 'offline'}`);
        });

        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on('leave_room', (roomId) => {
            socket.leave(roomId);
            console.log(`User ${socket.id} left room ${roomId}`);
        });

        socket.on('send_message', (data) => {
            // Handle different message types
            const messageData = {
                id: Date.now().toString(),
                message: data.message,
                sender: data.sender,
                created_at: new Date().toISOString(),
                sender_name: data.sender_name,
                type: data.type || 'text' // Add message type
            };

            // If it's a meeting message, add meeting data
            if (data.type === 'meeting') {
                try {
                    const meetingData = typeof data.message === 'string' 
                        ? JSON.parse(data.message) 
                        : data.message;
                        
                    messageData.meetingData = {
                        title: meetingData.data.title,
                        scheduledDate: meetingData.data.scheduledDate,
                        joinUrl: meetingData.data.joinUrl,
                        timezone: meetingData.data.timezone
                    };
                } catch (error) {
                    console.error('Error parsing meeting data:', error);
                }
            }

            io.to(data.roomId).emit('receive_message', messageData);
        });

        socket.on('typing', (data) => {
            socket.to(data.roomId).emit('user_typing', {
                userId: data.userId,
                username: data.username
            });
        });

        socket.on('stop_typing', (data) => {
            socket.to(data.roomId).emit('user_stop_typing', {
                userId: data.userId
            });
        });

        socket.on('disconnect', () => {
            // Find and remove the disconnected user from our map
            let disconnectedUserId = null;
            for (const [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    break;
                }
            }

            if (disconnectedUserId) {
                connectedUsers.delete(disconnectedUserId);
                // Broadcast to all clients that this user is now offline
                io.emit('user_disconnected', { userId: disconnectedUserId });
                console.log(`User ${disconnectedUserId} disconnected and removed from storage`);
            }

            console.log('User disconnected:', socket.id);
        });
    });

    return io;
}

module.exports = { initSocket };