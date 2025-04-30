import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Chat, { IChat } from './../../../../lib/models/Chat';
import Care from './../../../../lib/models/Care';
import { Types } from 'mongoose';

// Define a plain object type for chat room data
interface UserProfile {
    user_id: string;
    profilePic: string;
    name: string;
}

// Define a plain object type for chat room data without Document methods
interface ChatRoomWithProfiles {
    _id: Types.ObjectId;
    users: string[];
    messages: Array<{
        id: Types.ObjectId;
        message: string;
        sender: string;
        status: number;
        created_at: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
    usersWithProfiles: UserProfile[];
}

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const data = await req.json();
        const { user_id } = data;

        // Connect to the database
        await connectToDatabase();

        // Input validation
        if (!user_id) {
            return NextResponse.json(
                {
                    message: "User ID is required",
                    success: false
                },
                { status: 400 }
            );
        }

        // Fetch chat rooms involving the user
        const chatRooms = await Chat.find({
            users: { $in: [user_id] }
        }).sort({ updatedAt: -1 });

        // Fetch profile information from the Care model
        const chatRoomsWithProfiles: ChatRoomWithProfiles[] = await Promise.all(
            chatRooms.map(async (chatRoom) => {
                const usersWithProfiles = await Promise.all(
                    chatRoom.users.map(async (userId) => {
                        const userCare = await Care.findOne({ user_id: userId });
                        return {
                            user_id: userId,
                            profilePic: userCare?.profilePic || "https://cdn-icons-png.flaticon.com/512/1808/1808546.png",
                            name: userCare?.username || "User",
                        };
                    })
                );

                // Convert mongoose document to plain object and add profiles
                const plainChatRoom = {
                    _id: chatRoom._id,
                    users: chatRoom.users,
                    messages: chatRoom.messages.map(msg => ({
                        id: msg.id,
                        message: msg.message,
                        sender: msg.sender,
                        status: msg.status,
                        created_at: msg.created_at
                    })),
                    createdAt: chatRoom.createdAt,
                    updatedAt: chatRoom.updatedAt,
                    usersWithProfiles
                };

                return plainChatRoom;
            })
        );

        return NextResponse.json(
            {
                message: "Chat rooms fetched successfully",
                data: chatRoomsWithProfiles,
                success: true
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Fetch Chat Rooms Error:', error);
        return NextResponse.json(
            {
                message: "Failed to fetch chat rooms",
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}