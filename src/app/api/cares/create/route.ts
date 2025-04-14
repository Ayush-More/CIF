import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import Care from './../../../../lib/models/Care';

export async function POST(req: NextRequest) {
    const data = await req.json();

    try {
        await connectToDatabase();
        console.log(data, 77777777);
        // Create a new Care
        const care = await Care.create(data);

        return NextResponse.json({ message: 'Care created successfully', care, success: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to create care', error }, { status: 500 });
    }
}