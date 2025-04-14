import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Review from './../../../../lib/models/Review';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!user_id) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const reviews = await Review.find({ user_id })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('care_id', 'category username'); // Populate care provider details

        const totalReviews = await Review.countDocuments({ user_id });

        return NextResponse.json({
            message: 'User reviews retrieved successfully',
            data: reviews,
            totalReviews,
            currentPage: page,
            totalPages: Math.ceil(totalReviews / limit),
        });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to retrieve user reviews', error }, { status: 500 });
    }
}