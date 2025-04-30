const { Server } = require('socket.io');

function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

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
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
}

module.exports = { initSocket };