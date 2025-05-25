import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { recipientEmail, senderName, messagePreview } = await request.json();

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: `New message from ${senderName}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>New Message Notification</h2>
                    <p><strong>${senderName}</strong> has sent you a new message:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
                        <p style="margin: 0;">${messagePreview}</p>
                    </div>
                    <p>Login to your account to view and reply to this message.</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true, message: 'Email notification sent successfully' });
    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send email notification' },
            { status: 500 }
        );
    }
}