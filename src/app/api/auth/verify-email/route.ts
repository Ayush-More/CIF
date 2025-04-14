import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import User from './../../../../lib/models/User';

export async function POST(req: NextRequest) {
    const { email, otp } = await req.json();

    if (!email || !otp) {
        return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.emailOtp !== otp) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        // Update the user's verified status
        user.verified = true;
        user.emailOtp = ''; // Clear the OTP after successful verification
        await user.save();

        return NextResponse.json({ message: 'User verified successfully', success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}