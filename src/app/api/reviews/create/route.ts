import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Review from './../../../../lib/models/Review';
import Care from './../../../../lib/models/Care';

export async function POST(req: NextRequest) {
    const { care_id, user_id, rating, comment } = await req.json();

    if (!care_id || !user_id || !comment) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Check if the care provider exists
        const care = await Care.findById(care_id);
        if (!care) {
            return NextResponse.json({ message: 'Care provider not found' }, { status: 404 });
        }

        // Create the review
        const review = await Review.create({
            care_id,
            user_id,
            rating,
            comment,
        });

        // Optionally, update the overall ratings for the care provider here

        return NextResponse.json({ message: 'Review created successfully', review }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to create review', error }, { status: 500 });
    }
}