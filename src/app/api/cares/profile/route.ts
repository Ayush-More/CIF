import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Care from './../../../../lib/models/Care';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const careProfile = await Care.findOne({ user_id: userId });

        if (!careProfile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile retrieved successfully', data: careProfile });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to retrieve profile', error }, { status: 500 });
    }
}