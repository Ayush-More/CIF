import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Care from './../../../../lib/models/Care';

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const data = await req.json();

        // Connect to the database
        await connectToDatabase();

        // Core required fields validation
        const requiredFields = [
            "user_id",
            "category",
            "workingDays",
            "timings",
            "languages",
            "hourlyRate",
            "username",
            "gender",
            "dateOfBirth",
            "about",
            "skills",
        ];

        const missingFields = requiredFields.filter((field) => !data[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    message: `Validation failed: Missing required fields - ${missingFields.join(", ")}`,
                    success: false,
                },
                { status: 400 }
            );
        }

        // Validate enum values and data types
        const validations = [
            {
                condition: !["childcare", "mentalphysical", "mealservice", "tutoring"].includes(data.category),
                message: "Invalid category value"
            },
            {
                condition: !["Daily", "Weekly", "Monthly"].includes(data.timings),
                message: "Invalid timings value"
            },
            {
                condition: !Array.isArray(data.languages) || data.languages.length === 0,
                message: "Languages must be a non-empty array"
            },
            {
                condition: !Array.isArray(data.workingDays) || data.workingDays.length === 0,
                message: "Working days must be a non-empty array"
            },
            {
                condition: typeof data.hourlyRate !== "number" || data.hourlyRate <= 0,
                message: "Hourly rate must be a positive number"
            }
        ];

        for (const validation of validations) {
            if (validation.condition) {
                return NextResponse.json(
                    { message: `Validation failed: ${validation.message}`, success: false },
                    { status: 400 }
                );
            }
        }

        // Optional field validations
        if (data.profileViews && typeof data.profileViews !== 'number') {
            data.profileViews = 0; // Set default if invalid
        }

        if (data.ratings && !Array.isArray(data.ratings)) {
            data.ratings = []; // Set default if invalid
        }

        // Validate array fields if they exist
        const arrayFields = ['availableLocation', 'availableWorkDays', 'ageGroups', 'languagesSpoken'];
        arrayFields.forEach(field => {
            if (data[field] && !Array.isArray(data[field])) {
                data[field] = []; // Set default if invalid
            }
        });

        // Set default values for optional fields if not provided
        const defaultValues = {
            profilePic: "https://cdn-icons-png.flaticon.com/512/1808/1808546.png",
            repost: new Date(),
            profileViews: 0
        };

        // Merge default values with provided data
        const careData = {
            ...defaultValues,
            ...data
        };

        // Create the Care document
        const care = await Care.create(careData);

        return NextResponse.json(
            {
                message: "Care profile created successfully",
                care,
                success: true
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Care creation error:', error);

        // Handle mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: Object.values(error.errors),
                    success: false,
                },
                { status: 400 }
            );
        }

        // Handle other errors
        return NextResponse.json(
            {
                message: "Failed to create care profile",
                error: error.message || "Internal server error",
                success: false,
            },
            { status: 500 }
        );
    }
}