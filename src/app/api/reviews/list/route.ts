import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Review from './../../../../lib/models/Review';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const care_id = searchParams.get('care_id');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!care_id) {
            return NextResponse.json({
                success: false,
                message: 'Care ID is required'
            }, { status: 400 });
        }

        await connectToDatabase();

        const careObjectId = new mongoose.Types.ObjectId(care_id);

        // Update the populate to include more user fields
        const reviews = await Review.find({ care_id: careObjectId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: 'user_id',
                select: 'name email profilePic username', // Include relevant user fields
                model: 'User' // Explicitly specify the model
            })
            .lean();

        // Transform the data to include user details
        const formattedReviews = reviews.map(review => ({
            ...review,
            user: {
                name: review.user_id?.name || review.user_id?.username,
                email: review.user_id?.email,
                profilePic: review.user_id?.profilePic
            }
        }));

        const totalReviews = await Review.countDocuments({ care_id: careObjectId });

        return NextResponse.json({
            success: true,
            message: 'Reviews retrieved successfully',
            data: formattedReviews,
            totalReviews,
            currentPage: page,
            totalPages: Math.ceil(totalReviews / limit),
        });
    } catch (error: any) {
        console.error('Review listing error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve reviews',
            error: error.message
        }, { status: 500 });
    }
}