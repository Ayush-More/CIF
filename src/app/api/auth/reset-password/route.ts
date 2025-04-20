import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from './../../../../lib/mongodb';
import User from './../../../../lib/models/User';
import PasswordReset from './../../../../lib/models/PasswordReset';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { message: 'Email and new password are required' },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        // const passwordReset = await PasswordReset.findOne({ email, otp });
        // if (!passwordReset) {
        //     return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        // }

        // if (passwordReset.expiresAt < new Date()) {
        //     return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
        // }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.updateOne({ email }, { password: hashedPassword });

        // Remove OTP entry after successful reset
        await PasswordReset.deleteOne({ email });

        return NextResponse.json({ message: 'Password reset successfully', success: true });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}