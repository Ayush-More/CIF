import { Server as ServerIO } from 'socket.io';

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        const io = new ServerIO(res.socket.server, {
            path: '/api/socketio',
            addTrailingSlash: false,
            cors: {
                origin: process.env.NEXT_PUBLIC_APP_URL || "https://careforindiansv2.vercel.app",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        // Socket.IO event handlers
        io.on('connection', (socket) => {
            console.log('Socket connected:', socket.id);

            socket.on('join_room', (roomId) => {
                socket.join(roomId);
                console.log(`User ${socket.id} joined room ${roomId}`);
            });

            socket.on('leave_room', (roomId) => {
                socket.leave(roomId);
                console.log(`User ${socket.id} left room ${roomId}`);
            });

            socket.on('send_message', (data) => {
                const messageData = {
                    id: Date.now().toString(),
                    message: data.message,
                    sender: data.sender,
                    sender_name: data.sender_name,
                    created_at: new Date().toISOString(),
                    type: data.type || 'text'
                };

                if (data.type === 'meeting') {
                    try {
                        const meetingInfo = typeof data.message === 'string' 
                            ? JSON.parse(data.message) 
                            : data.message;
                            
                        messageData.meetingData = meetingInfo.data;
                    } catch (error) {
                        console.error('Error parsing meeting data:', error);
                    }
                }

                io.to(data.roomId).emit('receive_message', messageData);
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected:', socket.id);
            });
        });

        res.socket.server.io = io;
    }
    res.end();
};

export default ioHandler;