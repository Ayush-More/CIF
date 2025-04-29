import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Chat from './../../../../lib/models/Chat';
import { Types } from 'mongoose';

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const { user_id } = await req.json();

        // Validate user_id
        if (!user_id) {
            return NextResponse.json(
                {
                    message: "User ID is required",
                    success: false
                },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Perform aggregation to get last seen data
        const lastSeenData = await Chat.aggregate([
            // Match chats where current user is involved
            {
                $match: {
                    users: { $in: [new Types.ObjectId(user_id)] }
                }
            },
            // Project to filter out current user from users array
            {
                $project: {
                    users: {
                        $filter: {
                            input: "$users",
                            as: "user",
                            cond: {
                                $ne: ["$$user", new Types.ObjectId(user_id)]
                            }
                        }
                    }
                }
            },
            // Sort by most recent chats
            {
                $sort: {
                    updatedAt: -1
                }
            },
            // Unwind the filtered users array
            {
                $unwind: "$users"
            },
            // Group by unique users
            {
                $group: {
                    _id: "$users"
                }
            },
            // Lookup last seen data
            {
                $lookup: {
                    from: "lastseens",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "lastSeenData"
                }
            },
            // Lookup user data from Care collection
            {
                $lookup: {
                    from: "cares",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "userData"
                }
            },
            // Unwind the arrays (if there's matching data)
            {
                $unwind: {
                    path: "$lastSeenData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Project final shape of the data
            {
                $project: {
                    _id: 0,
                    user_id: "$_id",
                    username: "$userData.username",
                    profilePic: {
                        $ifNull: [
                            "$userData.profilePic",
                            "https://cdn-icons-png.flaticon.com/512/1808/1808546.png"
                        ]
                    },
                    lastSeen: {
                        $ifNull: ["$lastSeenData.lastSeen", null]
                    },
                    isOnline: {
                        $ifNull: ["$lastSeenData.isOnline", false]
                    }
                }
            }
        ]);

        return NextResponse.json(
            {
                message: "Last seen data retrieved successfully",
                data: lastSeenData,
                success: true
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Get Last Seen Data Error:', error);
        return NextResponse.json(
            {
                message: "Failed to retrieve last seen data",
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}