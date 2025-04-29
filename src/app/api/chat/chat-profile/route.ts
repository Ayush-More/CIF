import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Care from './../../../../lib/models/Care';
import { Types } from 'mongoose';

interface ChatProfileResponse {
    username?: string;
    profilePic?: string;
    location?: string;
    total_reviews: number;
    average_rating: number;
    about?: string;
    isOnline?: boolean;
    lastSeen?: Date;
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

        // Find the care provider
        const care = await Care.findOne(
            { user_id: new Types.ObjectId(user_id) },
            {
                username: 1,
                profilePic: 1,
                location: 1,
                total_reviews: 1,
                average_rating: 1,
                about: 1
            }
        );

        if (!care) {
            return NextResponse.json(
                {
                    message: "User not found",
                    success: false
                },
                { status: 404 }
            );
        }

        // Get last seen status (if you have LastSeen model)
        // const lastSeenStatus = await LastSeen.findOne({ user_id });

        const chatProfile: ChatProfileResponse = {
            username: care.username || "Anonymous User",
            profilePic: care.profilePic || "https://cdn-icons-png.flaticon.com/512/1808/1808546.png",
            location: care.location || "Mumbai",
            total_reviews: care.total_reviews || 0,
            average_rating: care.average_rating || 5,
            about: care.about || "",
            // isOnline: lastSeenStatus?.isOnline || false,
            // lastSeen: lastSeenStatus?.lastSeen
        };

        return NextResponse.json(
            {
                message: "Chat profile retrieved successfully",
                data: chatProfile,
                success: true
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Get Chat Profile Error:', error);
        return NextResponse.json(
            {
                message: "Failed to retrieve chat profile",
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}