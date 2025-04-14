import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Review from './../../../../lib/models/Review';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const care_id = searchParams.get('care_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!care_id) {
        return NextResponse.json({ message: 'Care ID is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const reviews = await Review.find({ care_id })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user_id', 'name'); // Populate user details

        const totalReviews = await Review.countDocuments({ care_id });

        return NextResponse.json({
            message: 'Reviews retrieved successfully',
            data: reviews,
            totalReviews,
            currentPage: page,
            totalPages: Math.ceil(totalReviews / limit),
        });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to retrieve reviews', error }, { status: 500 });
    }
}