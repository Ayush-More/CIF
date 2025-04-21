import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Review from './../../../../lib/models/Review';
import Care from './../../../../lib/models/Care';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { care_id, user_id, rating, comment } = body;

        if (!care_id || !user_id || !comment) {
            return NextResponse.json({
                success: false,
                message: 'All fields are required'
            }, { status: 400 });
        }

        await connectToDatabase();

        const careObjectId = new mongoose.Types.ObjectId(care_id);
        const userObjectId = new mongoose.Types.ObjectId(user_id);

        // Check if user has already reviewed
        const existingReview = await Review.findOne({
            care_id: careObjectId,
            user_id: userObjectId
        });

        if (existingReview) {
            return NextResponse.json({
                success: false,
                message: 'You have already reviewed this care provider',
                error: 'DUPLICATE_REVIEW'
            }, { status: 409 }); // 409 Conflict
        }

        // Check if the care provider exists
        const care = await Care.findById(careObjectId);
        if (!care) {
            return NextResponse.json({
                success: false,
                message: 'Care provider not found'
            }, { status: 404 });
        }

        // Create the review
        const review = await Review.create({
            care_id: careObjectId,
            user_id: userObjectId,
            rating: rating || 5,
            comment,
        });

        // Populate user details in the response
        const populatedReview = await Review.findById(review._id)
            .populate({
                path: 'user_id',
                select: 'name email profilePic username',
                model: 'User'
            })
            .lean();

        return NextResponse.json({
            success: true,
            message: 'Review created successfully',
            review: populatedReview
        }, { status: 201 });
    } catch (error: any) {
        // Handle mongoose duplicate key error
        if (error.code === 11000) {
            return NextResponse.json({
                success: false,
                message: 'You have already reviewed this care provider',
                error: 'DUPLICATE_REVIEW'
            }, { status: 409 });
        }

        console.error('Review creation error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create review',
            error: error.message
        }, { status: 500 });
    }
}