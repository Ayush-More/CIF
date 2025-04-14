import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from './../../../../lib/mongodb';
import User from './../../../../lib/models/User';
import { sendEmail } from './../../../../lib/email';
import { generateOTP } from './../../../../lib/otp';

export async function POST(req: NextRequest) {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
        return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const otp = generateOTP();

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            emailOtp: otp, // Save the OTP in the database
        });
        console.log(newUser);
        await newUser.save();

        // Send the OTP to the user's email
        await sendEmail(email, 'Verify your account', `Your OTP is: ${otp}`);

        return NextResponse.json({ message: 'Otp has been sent successfully' , newUser }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}