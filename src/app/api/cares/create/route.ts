import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Care from './../../../../lib/models/Care';

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const data = await req.json();

        // Connect to the database
        await connectToDatabase();

        // Perform manual validation before creating the document
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
                    message: `Validation failed: Missing fields - ${missingFields.join(", ")}`,
                    success: false,
                },
                { status: 400 }
            );
        }

        // Check additional validations
        if (!["childcare", "mentalphysical", "mealservice", "tutoring"].includes(data.category)) {
            return NextResponse.json(
                { message: "Validation failed: Invalid category value", success: false },
                { status: 400 }
            );
        }

        if (!["Daily", "Weekly", "Monthly"].includes(data.timings)) {
            return NextResponse.json(
                { message: "Validation failed: Invalid timings value", success: false },
                { status: 400 }
            );
        }

        if (!Array.isArray(data.languages) || data.languages.length === 0) {
            return NextResponse.json(
                { message: "Validation failed: Languages must be a non-empty array", success: false },
                { status: 400 }
            );
        }

        if (!Array.isArray(data.workingDays) || data.workingDays.length === 0) {
            return NextResponse.json(
                { message: "Validation failed: Working days must be a non-empty array", success: false },
                { status: 400 }
            );
        }

        if (typeof data.hourlyRate !== "number" || data.hourlyRate <= 0) {
            return NextResponse.json(
                { message: "Validation failed: Hourly rate must be a positive number", success: false },
                { status: 400 }
            );
        }

        // Create the Care document
        const care = await Care.create(data);

        return NextResponse.json({ message: "Care created successfully", care, success: true }, { status: 201 });
    } catch (error) {
        // Handle any validation or database errors
        return NextResponse.json(
            {
                message: "Failed to create care",
                error: error.message || error,
                success: false,
            },
            { status: 500 }
        );
    }
}