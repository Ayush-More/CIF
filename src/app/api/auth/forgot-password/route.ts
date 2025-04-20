import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import User from './../../../../lib/models/User';
import PasswordReset from './../../../../lib/models/PasswordReset';
import { generateOTP } from './../../../../lib/otp';
import { sendEmail } from '../../../../lib/email';

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        await PasswordReset.create({
            email,
            otp,
            expiresAt,
        });

        await sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}`);

        // Include the user ID in the response
        return NextResponse.json({
            message: 'OTP sent to email',
            userId: user._id, // Add the user ID here
            success: true,
        });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}