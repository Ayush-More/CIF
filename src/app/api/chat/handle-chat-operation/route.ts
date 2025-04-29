import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Chat from './../../../../lib/models/Chat';
import { Types } from 'mongoose';

// Define interfaces for the request payloads with discriminated union
interface BaseChatData {
    roomID: string;
    sender: string;
}

interface SaveChatData extends BaseChatData {
    type: 'saveChat';
    message: string;
}

interface UpdateChatStatusData extends BaseChatData {
    type: 'updateChatStatus';
}

type ChatOperationData = SaveChatData | UpdateChatStatusData;

// Type guard functions
function isSaveChatData(data: ChatOperationData): data is SaveChatData {
    return data.type === 'saveChat';
}

function isUpdateChatStatusData(data: ChatOperationData): data is UpdateChatStatusData {
    return data.type === 'updateChatStatus';
}

async function saveChat(data: SaveChatData) {
    await Chat.updateOne(
        { _id: new Types.ObjectId(data.roomID) },
        {
            $push: {
                messages: {
                    id: new Types.ObjectId(),
                    message: data.message,
                    sender: data.sender,
                    status: 0,
                    created_at: new Date()
                }
            }
        }
    );
}

async function updateChatStatus(data: UpdateChatStatusData) {
    try {
        await Chat.updateOne(
            { _id: new Types.ObjectId(data.roomID) },
            {
                $set: {
                    "messages.$[elem].status": 1
                }
            },
            {
                arrayFilters: [{ 'elem.sender': { $eq: data.sender } }]
            }
        );
    } catch (error) {
        console.error('Update Chat Status Error:', error);
        throw error;
    }
}

export async function POST(req: NextRequest) {
    try {
        // Connect to database
        await connectToDatabase();

        // Parse the request body
        const data: ChatOperationData = await req.json();

        // Input validation
        if (!data || !data.type || !data.roomID || !data.sender) {
            return NextResponse.json(
                {
                    message: "Missing required fields",
                    success: false
                },
                { status: 400 }
            );
        }

        switch (data.type) {
            case "saveChat":
                if (!isSaveChatData(data) || !data.message) {
                    return NextResponse.json(
                        {
                            message: "Missing message field for saveChat",
                            success: false
                        },
                        { status: 400 }
                    );
                }
                await saveChat(data);
                return NextResponse.json(
                    {
                        message: "Chat saved successfully",
                        success: true
                    },
                    { status: 200 }
                );

            case "updateChatStatus":
                if (!isUpdateChatStatusData(data)) {
                    return NextResponse.json(
                        {
                            message: "Invalid data for updateChatStatus",
                            success: false
                        },
                        { status: 400 }
                    );
                }
                await updateChatStatus(data);
                return NextResponse.json(
                    {
                        message: "Chat status updated successfully",
                        success: true
                    },
                    { status: 200 }
                );

            default:
                return NextResponse.json(
                    {
                        message: "Invalid operation type",
                        success: false
                    },
                    { status: 400 }
                );
        }
    } catch (error: any) {
        console.error('Chat Operation Error:', error);
        return NextResponse.json(
            {
                message: "Failed to process chat operation",
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}