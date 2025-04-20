import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import User from './../../../../lib/models/User';
import PasswordReset from './../../../../lib/models/PasswordReset';

export async function POST(req: NextRequest) {
    const { userId, otp } = await req.json();
    console.log(userId)

    if (!userId || !otp) {
        return NextResponse.json({ message: 'User ID and OTP are required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Fetch the email from the User model using userId
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const email = user.email;

        // Check the OTP in the PasswordReset model using the email and otp
        const passwordReset = await PasswordReset.findOne({ email, otp });

        if (!passwordReset) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        if (passwordReset.expiresAt < new Date()) {
            return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
        }

        return NextResponse.json({ message: 'OTP verified successfully', success: true });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}