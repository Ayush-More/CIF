import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Care from './../../../../lib/models/Care';

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const data = await req.json();

        // Connect to the database
        await connectToDatabase();

        // No required fields as per the new model
        // Just validate the data types if they are provided

        // Validate enum values and data types if they exist
        const validations = [
            {
                condition: data.category && !["childcare", "mentalphysical", "mealservice", "tutoring"].includes(data.category),
                message: "Invalid category value"
            },
            {
                condition: data.timings && !["Daily", "Weekly", "Monthly"].includes(data.timings),
                message: "Invalid timings value"
            },
            {
                condition: data.workingDays && (!Array.isArray(data.workingDays)),
                message: "Working days must be an array"
            },
            {
                condition: data.languages && (!Array.isArray(data.languages)),
                message: "Languages must be an array"
            },
            {
                condition: data.hourlyRate && (typeof data.hourlyRate !== "number" || data.hourlyRate < 0),
                message: "Hourly rate must be a non-negative number"
            },
            {
                condition: data.careFor && (typeof data.careFor !== "number" || data.careFor < 0),
                message: "Care for must be a non-negative number"
            },
            {
                condition: data.mealTypes && !Array.isArray(data.mealTypes),
                message: "Meal types must be an array"
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

        // Set default values
        const defaultValues = {
            location: "Mumbai",
            ratings: 4.5,
            profilePic: "https://cdn-icons-png.flaticon.com/512/1808/1808546.png"
        };

        // Merge default values with provided data
        const careData = {
            ...defaultValues,
            ...data,
            // Convert specific fields to their proper types
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            schoolDrop: data.schoolDrop ? Boolean(data.schoolDrop) : undefined,
            smoking: data.smoking ? Boolean(data.smoking) : undefined,
            overnightCare: data.overnightCare ? Boolean(data.overnightCare) : undefined,
            offerSubscription: data.offerSubscription ? Boolean(data.offerSubscription) : undefined
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

    } catch (error: any) {
        console.error('Care creation error:', error);
        return NextResponse.json(
            {
                message: "Failed to create care profile",
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}