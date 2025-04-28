import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verify } from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import ChatMessage from './models/ChatMessage';

let io: SocketIOServer;

export const initializeSocket = (server: HTTPServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.use((socket, next) => {
        try {
            const cookies = parseCookies({ req: socket.request });
            const token = cookies.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = verify(token, process.env.JWT_SECRET!);
            socket.data.user = decoded;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.data.user.userId;
        socket.join(userId);

        socket.on('send_message', async (data) => {
            try {
                const { receiverId, content } = data;
                const senderId = userId;

                // Save message to database
                const message = await ChatMessage.create({
                    sender: senderId,
                    receiver: receiverId,
                    content
                });

                // Emit to both sender and receiver
                io.to(senderId).emit('receive_message', message);
                io.to(receiverId).emit('receive_message', message);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            socket.leave(userId);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};