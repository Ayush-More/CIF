import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import Care from '../../../../lib/models/Care';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Get user data
        const userData = await User.findById(userId).select('-password -emailOtp');

        if (!userData) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check if user is a care provider
        const careProfile = await Care.findOne({ user_id: userId })
            .select('+total_reviews +average_rating')
            .lean();

        const profile = {
            ...userData.toObject(),
            isCareProvider: !!careProfile,
            careProfile: careProfile || null
        };

        return NextResponse.json({
            success: true,
            data: profile
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({
            success: false,
            message: 'Error fetching profile'
        }, { status: 500 });
    }
}