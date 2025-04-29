import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Chat from './../../../../lib/models/Chat';
import Care from './../../../../lib/models/Care';

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const data = await req.json();
        const { to, from } = data;

        // Connect to the database
        await connectToDatabase();

        // Input validation
        if (!to || !from) {
            return NextResponse.json(
                {
                    message: "Invalid Users !!!",
                    success: false
                },
                { status: 400 }
            );
        }

        // Check if user exists using userId
        const care = await Care.findOne({ user_id: to });
        if (!care) {
            return NextResponse.json(
                {
                    message: "No User Exists !!!",
                    success: false
                },
                { status: 404 }
            );
        }

        // Find existing chat room
        let chat = await Chat.findOne({
            $and: [{ users: to }, { users: from }]
        });

        // Create new chat room if it doesn't exist
        if (!chat) {
            chat = await Chat.create({
                users: [to, from],
                messages: [] // Initialize with empty messages array
            });
        }

        if (!chat) {
            return NextResponse.json(
                {
                    message: "Unable to create room !!!",
                    success: false
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: "Chat room created successfully",
                roomID: chat._id.toString(),
                success: true
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Create Room Error:', error);
        return NextResponse.json(
            {
                message: "Failed to create chat room",
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}