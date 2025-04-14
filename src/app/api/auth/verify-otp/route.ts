import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './../../../../lib/mongodb';
import PasswordReset from './../../../../lib/models/PasswordReset';

export async function POST(req: NextRequest) {
    const { email, otp } = await req.json();

    if (!email || !otp) {
        return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const passwordReset = await PasswordReset.findOne({ email, otp });

        if (!passwordReset) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        if (passwordReset.expiresAt < new Date()) {
            return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
        }

        return NextResponse.json({ message: 'OTP verified successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}