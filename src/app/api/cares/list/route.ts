import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Care from './../../../../lib/models/Care';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const category = searchParams.get('category');
    const ratings = searchParams.get('ratings');
    const location = searchParams.get('location');

    try {
        await connectToDatabase();

        const filters: any = {};
        if (category) filters.category = category;
        if (ratings) filters.ratings = { $gte: parseFloat(ratings) }; // Ratings threshold
        if (location) filters.location = location;

        const cares = await Care.find(filters)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalCares = await Care.countDocuments(filters);

        return NextResponse.json({
            message: 'Cares retrieved successfully',
            data: cares,
            totalCares,
            currentPage: page,
            totalPages: Math.ceil(totalCares / limit),
        });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to retrieve cares', error }, { status: 500 });
    }
}