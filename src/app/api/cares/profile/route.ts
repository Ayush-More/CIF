import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Care, { ICare } from './../../../../lib/models/Care';


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // const careProfile = await Care.findOne({ user_id: userId })
        //     .select('+total_reviews +average_rating') // Ensure these fields are included
        //     .lean();
        const careProfile = await Care.findOne({ user_id: userId })
            .select('+total_reviews +average_rating')
            .lean() as unknown as ICare;

        if (!careProfile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        // Transform the data to include formatted review data
        const formattedProfile = {
            ...careProfile,
            average_rating: careProfile.average_rating || 3,
            total_reviews: careProfile.total_reviews || 0
        };

        return NextResponse.json({
            message: 'Profile retrieved successfully',
            data: formattedProfile
        });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to retrieve profile', error }, { status: 500 });
    }
}