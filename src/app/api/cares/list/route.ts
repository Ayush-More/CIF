// import { NextRequest, NextResponse } from 'next/server';
// import connectToDatabase from './../../../../lib/mongodb';
// import Care from './../../../../lib/models/Care';

// export async function GET(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);

//         // Pagination parameters
//         const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
//         const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));

//         // Filter parameters
//         const category = searchParams.get('category');
//         const ratings = searchParams.get('ratings');
//         const location = searchParams.get('location');
//         const hourlyRate = searchParams.get('hourlyRate');
//         const gender = searchParams.get('gender');
//         const languages = searchParams.get('languages');
//         const workingDays = searchParams.get('workingDays');
//         const timings = searchParams.get('timings');
//         const sortBy = searchParams.get('sortBy') || 'createdAt';
//         const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

//         await connectToDatabase();

//         // Build filter object
//         const filters: any = {};

//         // Add filters if they exist
//         if (category) {
//             filters.category = category;
//         }

//         if (ratings) {
//             filters.ratings = { $gte: parseFloat(ratings) };
//         }

//         if (location) {
//             filters.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive location search
//         }

//         if (hourlyRate) {
//             const [min, max] = hourlyRate.split('-').map(Number);
//             if (max) {
//                 filters.hourlyRate = { $gte: min, $lte: max };
//             } else {
//                 filters.hourlyRate = { $gte: min };
//             }
//         }

//         if (gender) {
//             filters.gender = gender;
//         }

//         if (languages) {
//             filters['languages.language'] = { $in: languages.split(',') };
//         }

//         if (workingDays) {
//             filters.workingDays = { $in: workingDays.split(',') };
//         }

//         if (timings) {
//             filters.timings = timings;
//         }

//         // Build sort object
//         const sortOptions: any = {};
//         sortOptions[sortBy] = sortOrder;

//         // Execute query with pagination
//         const [cares, totalCares] = await Promise.all([
//             Care.find(filters)
//                 .sort(sortOptions)
//                 .skip((page - 1) * limit)
//                 .limit(limit)
//                 .select('-__v') // Exclude version key
//                 .lean(), // Convert to plain JavaScript objects
//             Care.countDocuments(filters)
//         ]);

//         // Calculate pagination metadata
//         const totalPages = Math.ceil(totalCares / limit);
//         const hasNextPage = page < totalPages;
//         const hasPrevPage = page > 1;

//         // Return formatted response
//         return NextResponse.json({
//             success: true,
//             message: 'Care providers retrieved successfully',
//             data: {
//                 cares,
//                 pagination: {
//                     totalCares,
//                     currentPage: page,
//                     totalPages,
//                     limit,
//                     hasNextPage,
//                     hasPrevPage,
//                     nextPage: hasNextPage ? page + 1 : null,
//                     prevPage: hasPrevPage ? page - 1 : null
//                 },
//                 filters: {
//                     category,
//                     ratings,
//                     location,
//                     hourlyRate,
//                     gender,
//                     languages,
//                     workingDays,
//                     timings
//                 },
//                 sorting: {
//                     sortBy,
//                     sortOrder: sortOrder === 1 ? 'asc' : 'desc'
//                 }
//             }
//         }, { status: 200 });

//     } catch (error) {
//         console.error('Error fetching care providers:', error);

//         return NextResponse.json({
//             success: false,
//             message: 'Failed to retrieve care providers',
//             error: error.message || 'Internal server error',
//         }, { status: 500 });
//     }
// }

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Care from './../../../../lib/models/Care';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Pagination parameters
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));

        // Basic filter parameters
        const category = searchParams.get('category');
        const ratings = searchParams.get('ratings');
        const location = searchParams.get('location');
        const hourlyRate = searchParams.get('hourlyRate');
        const gender = searchParams.get('gender');
        const languages = searchParams.get('languages');
        const workingDays = searchParams.get('workingDays');
        const timings = searchParams.get('timings');

        // New filter parameters from CareFormContext
        const zipCode = searchParams.get('zipCode');
        const experience = searchParams.get('experience');
        const mode = searchParams.get('mode');
        const ageBand = searchParams.get('ageBand');
        const jobTiming = searchParams.get('jobTiming');
        const careFor = searchParams.get('careFor');
        const travelDistance = searchParams.get('travelDistance');
        const serviceType = searchParams.get('serviceType');
        const mealPrice = searchParams.get('mealPrice');
        const mealTypes = searchParams.get('mealTypes');

        // Boolean filters
        const schoolDrop = searchParams.get('schoolDrop');
        const smoking = searchParams.get('smoking');
        const overnightCare = searchParams.get('overnightCare');
        const offerSubscription = searchParams.get('offerSubscription');

        // Sorting parameters
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        await connectToDatabase();

        // Build filter object
        const filters: any = {};

        // Add basic filters if they exist
        if (category) {
            filters.category = category;
        }

        if (ratings) {
            filters.ratings = { $gte: parseFloat(ratings) };
        }

        if (location) {
            filters.location = { $regex: new RegExp(location, 'i') };
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
            filters['languages.name'] = { $in: languages.split(',') };
        }

        if (workingDays) {
            filters.workingDays = { $in: workingDays.split(',') };
        }

        if (timings) {
            filters.timings = timings;
        }

        // Add new filters from CareFormContext
        if (zipCode) {
            filters.zipCode = zipCode;
        }

        if (experience) {
            filters.experience = { $regex: new RegExp(experience, 'i') };
        }

        if (mode) {
            filters.mode = mode;
        }

        if (ageBand) {
            filters.ageBand = ageBand;
        }

        if (jobTiming) {
            filters.jobTiming = jobTiming;
        }

        if (careFor) {
            filters.careFor = parseInt(careFor);
        }

        if (travelDistance) {
            filters.travelDistance = travelDistance;
        }

        if (serviceType) {
            filters.serviceType = serviceType;
        }

        if (mealPrice) {
            filters.mealPrice = mealPrice;
        }

        if (mealTypes) {
            filters.mealTypes = { $in: mealTypes.split(',') };
        }

        // Add boolean filters
        if (schoolDrop !== null) {
            filters.schoolDrop = schoolDrop === 'true';
        }

        if (smoking !== null) {
            filters.smoking = smoking === 'true';
        }

        if (overnightCare !== null) {
            filters.overnightCare = overnightCare === 'true';
        }

        if (offerSubscription !== null) {
            filters.offerSubscription = offerSubscription === 'true';
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
                .select('-__v')
                .lean(),
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
                    // Basic filters
                    category,
                    ratings,
                    location,
                    hourlyRate,
                    gender,
                    languages,
                    workingDays,
                    timings,
                    // New filters
                    zipCode,
                    experience,
                    mode,
                    ageBand,
                    jobTiming,
                    careFor,
                    travelDistance,
                    serviceType,
                    mealPrice,
                    mealTypes,
                    // Boolean filters
                    schoolDrop,
                    smoking,
                    overnightCare,
                    offerSubscription
                },
                sorting: {
                    sortBy,
                    sortOrder: sortOrder === 1 ? 'asc' : 'desc'
                }
            }
        });

    } catch (error: any) {
        console.error('List cares error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to retrieve care providers',
                error: error.message
            },
            { status: 500 }
        );
    }
}