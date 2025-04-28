import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import ChatMessage from '../../../../lib/models/ChatMessage';
import { verifyAuth } from '../../../../lib/auth';
import { getIO } from '../../../../lib/socket';

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const otherUserId = url.searchParams.get('userId');

        if (!otherUserId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        await connectToDatabase();

        // Fetch messages between the two users
        const messages = await ChatMessage.find({
            $or: [
                { sender: user.userId, receiver: otherUserId },
                { sender: otherUserId, receiver: user.userId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'fullName')
            .populate('receiver', 'fullName');

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { receiverId, content } = await req.json();

        if (!receiverId || !content) {
            return NextResponse.json(
                { message: 'Receiver ID and content are required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const message = await ChatMessage.create({
            sender: user.userId,
            receiver: receiverId,
            content
        });

        // Get the IO instance and emit the message
        const io = getIO();
        io.to(receiverId).emit('receive_message', message);

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}