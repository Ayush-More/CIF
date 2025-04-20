import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Care from './../../../../lib/models/Care';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Pagination parameters
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));

        // Filter parameters
        const category = searchParams.get('category');
        const ratings = searchParams.get('ratings');
        const location = searchParams.get('location');
        const hourlyRate = searchParams.get('hourlyRate');
        const gender = searchParams.get('gender');
        const languages = searchParams.get('languages');
        const workingDays = searchParams.get('workingDays');
        const timings = searchParams.get('timings');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        await connectToDatabase();

        // Build filter object
        const filters: any = {};

        // Add filters if they exist
        if (category) {
            filters.category = category;
        }

        if (ratings) {
            filters.ratings = { $gte: parseFloat(ratings) };
        }

        if (location) {
            filters.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive location search
        }

        if (hourlyRate) {
            const [min, max] = hourlyRate.split('-').map(Number);
            if (max) {
                filters.hourlyRate = { $gte: min, $lte: max };
            } else {
                filters.hourlyRate = { $gte: min };
            }
        }

        if (gender) {
            filters.gender = gender;
        }

        if (languages) {
            filters['languages.language'] = { $in: languages.split(',') };
        }

        if (workingDays) {
            filters.workingDays = { $in: workingDays.split(',') };
        }

        if (timings) {
            filters.timings = timings;
        }

        // Build sort object
        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder;

        // Execute query with pagination
        const [cares, totalCares] = await Promise.all([
            Care.find(filters)
                .sort(sortOptions)
                .skip((page - 1) * limit)
                .limit(limit)
                .select('-__v') // Exclude version key
                .lean(), // Convert to plain JavaScript objects
            Care.countDocuments(filters)
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCares / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // Return formatted response
        return NextResponse.json({
            success: true,
            message: 'Care providers retrieved successfully',
            data: {
                cares,
                pagination: {
                    totalCares,
                    currentPage: page,
                    totalPages,
                    limit,
                    hasNextPage,
                    hasPrevPage,
                    nextPage: hasNextPage ? page + 1 : null,
                    prevPage: hasPrevPage ? page - 1 : null
                },
                filters: {
                    category,
                    ratings,
                    location,
                    hourlyRate,
                    gender,
                    languages,
                    workingDays,
                    timings
                },
                sorting: {
                    sortBy,
                    sortOrder: sortOrder === 1 ? 'asc' : 'desc'
                }
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching care providers:', error);

        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve care providers',
            error: error.message || 'Internal server error',
        }, { status: 500 });
    }
}