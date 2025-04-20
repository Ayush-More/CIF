import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from './../../../../lib/mongodb';
import User from './../../../../lib/models/User';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ message: 'Please provide email and password' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' } // Token valid for 7 days
        );
        const response = NextResponse.json({ message: 'Login successful', success: true, token });
        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}