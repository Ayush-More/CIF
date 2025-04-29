import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import LastSeen from './../../../../lib/models/LastSeen';
import { Types } from 'mongoose';

interface LastSeenRequest {
    type: 'userOnline' | 'userOffline';
    user_id: string;
}

async function userOnline(userId: string) {
    try {
        await LastSeen.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId) },
            {
                lastSeen: new Date(),
                isOnline: true
            },
            {
                new: true,
                upsert: true,
            }
        );
    } catch (error) {
        console.error('User Online Update Error:', error);
        throw error;
    }
}

async function userOffline(userId: string) {
    try {
        console.log("User Offline triggered for:", userId);

        await LastSeen.findOneAndUpdate(
            { user_id: new Types.ObjectId(userId) },
            {
                lastSeen: new Date(),
                isOnline: false
            },
            {
                new: true,
                upsert: true,
            }
        );
    } catch (error) {
        console.error('User Offline Update Error:', error);
        throw error;
    }
}

export async function POST(req: NextRequest) {
    try {
        // Connect to database
        await connectToDatabase();

        // Parse the request body
        const data: LastSeenRequest = await req.json();
        const { type, user_id } = data;

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

        if (!type || !['userOnline', 'userOffline'].includes(type)) {
            return NextResponse.json(
                {
                    message: "Invalid operation type",
                    success: false
                },
                { status: 400 }
            );
        }

        // Handle the operation based on type
        switch (type) {
            case 'userOnline':
                await userOnline(user_id);
                return NextResponse.json(
                    {
                        message: "User is now online",
                        success: true
                    },
                    { status: 200 }
                );

            case 'userOffline':
                await userOffline(user_id);
                return NextResponse.json(
                    {
                        message: "User is now offline",
                        success: true
                    },
                    { status: 200 }
                );
        }

    } catch (error: any) {
        console.error('Last Seen Update Error:', error);
        return NextResponse.json(
            {
                message: "Failed to update user status",
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}

// Get user's last seen status
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const user_id = searchParams.get('user_id');

        // Connect to database
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

        const lastSeen = await LastSeen.findOne({
            user_id: new Types.ObjectId(user_id)
        });

        if (!lastSeen) {
            return NextResponse.json(
                {
                    message: "User not found",
                    data: {
                        isOnline: false,
                        lastSeen: null
                    },
                    success: true
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                message: "User status retrieved successfully",
                data: {
                    isOnline: lastSeen.isOnline,
                    lastSeen: lastSeen.lastSeen
                },
                success: true
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Get Last Seen Error:', error);
        return NextResponse.json(
            {
                message: "Failed to get user status",
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}