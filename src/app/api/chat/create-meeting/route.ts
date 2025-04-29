import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import connectToDatabase from './../../../../lib/mongodb';
import ZoomToken from './../../../../lib/models/ZoomToken';

const accountID = process.env.ZOOM_ACCOUNT_ID || "RIgVb8QuT3u0-PEiIL8U8w";
const clientId = process.env.ZOOM_CLIENT_ID || "SC2XBl28SDKy8ppiD0p2SQ";
const clientSecret = process.env.ZOOM_CLIENT_SECRET || "ywBm9Mysdw5F8k5bXwQpMUiK9ZXJD3vw";

const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Updated return type to Promise<string>
const generateZoomToken = async (): Promise<string> => {
    try {
        const data = new URLSearchParams();
        data.append("grant_type", "account_credentials");
        data.append("account_id", accountID);

        const response = await fetch("https://zoom.us/oauth/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: data.toString(),
        });

        const result = await response.json();

        if (!result?.access_token) {
            throw new Error('Failed to generate access token');
        }

        return result.access_token;
    } catch (error) {
        console.error("Token Generation Error:", error);
        throw new Error('Failed to generate Zoom token');
    }
};

interface MeetingParams {
    topic: string;
    start_time: string;
    type: number;
    duration: number;
    timezone: string;
    agenda: string;
    token: string; // Changed from string | null to string
    retryCount?: number;
}

const createMeetingSpace = async (params: MeetingParams) => {
    const { topic, start_time, type, duration, timezone, agenda, token, retryCount = 1 } = params;

    try {
        const response = await axios.post(
            "https://api.zoom.us/v2/users/me/meetings",
            {
                topic,
                type,
                start_time,
                duration,
                timezone,
                agenda,
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                    watermark: false,
                    use_pmi: false,
                    approval_type: 0,
                    audio: "both",
                    auto_recording: "none",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error("Meeting Creation Error:", error.response?.data || error.message);

        if (retryCount > 0) {
            try {
                // Generate new token and retry
                const newToken = await generateZoomToken();
                await ZoomToken.create({ token: newToken });
                return createMeetingSpace({
                    ...params,
                    token: newToken,
                    retryCount: retryCount - 1
                });
            } catch (tokenError) {
                console.error("Token Refresh Error:", tokenError);
                throw new Error('Failed to refresh token');
            }
        }

        throw new Error('Failed to create meeting');
    }
};

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        // Get request body
        const body = await req.json();
        const { timezone, time, date, title, description } = body;

        if (!timezone || !time || !date || !title) {
            return NextResponse.json(
                {
                    message: "Missing required fields",
                    success: false
                },
                { status: 400 }
            );
        }

        // Get latest token
        const tokenDoc = await ZoomToken.findOne().sort({ createdAt: -1 });
        let token: string;

        // Generate new token if none exists
        if (!tokenDoc?.token) {
            try {
                token = await generateZoomToken();
                await ZoomToken.create({ token });
            } catch (error) {
                return NextResponse.json(
                    {
                        message: "Failed to generate Zoom token",
                        success: false
                    },
                    { status: 500 }
                );
            }
        } else {
            token = tokenDoc.token;
        }

        // Create meeting
        const result = await createMeetingSpace({
            topic: title,
            start_time: new Date(`${date}T${time}:00Z`).toISOString(),
            type: 2,
            duration: 45,
            timezone,
            agenda: description || "Meeting description not provided",
            token,
        });

        // Return successful response with meeting details
        return NextResponse.json({
            message: "Meeting created successfully",
            data: {
                join_url: result.data.join_url,
                start_url: result.data.start_url,
                password: result.data.password,
                meeting_id: result.data.id,
                start_time: result.data.start_time,
                duration: result.data.duration
            },
            success: true
        }, { status: 201 });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            {
                message: "Internal server error",
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        // Get latest token
        const tokenDoc = await ZoomToken.findOne().sort({ createdAt: -1 });
        let token: string;

        // Generate new token if none exists
        if (!tokenDoc?.token) {
            try {
                token = await generateZoomToken();
                await ZoomToken.create({ token });
            } catch (error) {
                return NextResponse.json(
                    {
                        message: "Failed to generate Zoom token",
                        success: false
                    },
                    { status: 500 }
                );
            }
        } else {
            token = tokenDoc.token;
        }

        // Create default meeting
        const result = await createMeetingSpace({
            topic: "Careforindians - Meeting",
            start_time: new Date().toISOString(),
            type: 2,
            duration: 45,
            timezone: "Asia/Kolkata",
            agenda: "Let's Discuss...",
            token
        });

        return NextResponse.json({
            message: "Meeting created successfully",
            data: {
                join_url: result.data.join_url,
                start_url: result.data.start_url,
                password: result.data.password,
                meeting_id: result.data.id,
                start_time: result.data.start_time,
                duration: result.data.duration
            },
            success: true
        }, { status: 201 });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            {
                message: "Internal server error",
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}