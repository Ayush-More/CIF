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

        // Validate rating
        const numericRating = Number(rating) || 5; // Convert to number, default to 5 if invalid
        if (numericRating < 1 || numericRating > 5) {
            return NextResponse.json({
                success: false,
                message: 'Rating must be between 1 and 5'
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
            }, { status: 409 });
        }

        // Check if the care provider exists
        const care = await Care.findById(careObjectId);
        if (!care) {
            return NextResponse.json({
                success: false,
                message: 'Care provider not found'
            }, { status: 404 });
        }

        // Create the review first
        const review = await Review.create({
            care_id: careObjectId,
            user_id: userObjectId,
            rating: numericRating,
            comment,
        });

        // After creating the review, get all reviews including the new one
        const allReviews = await Review.find({ care_id: careObjectId });

        // Calculate new average rating
        const totalRating = allReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const averageRating = allReviews.length > 0 ?
            Number((totalRating / allReviews.length).toFixed(1)) :
            numericRating; // If this is the first review, use its rating

        // Update care provider document with the new average
        await Care.findByIdAndUpdate(careObjectId, {
            $set: {
                total_reviews: allReviews.length,
                average_rating: averageRating
            }
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