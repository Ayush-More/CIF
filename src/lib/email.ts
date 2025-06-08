import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

export async function sendEmail(to: string, subject: string, text: string) {
    try {
        console.log("HIIIII")
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
    } catch (error) {
        throw new Error('Failed to send email');
    }
}

export async function sendLoginNotificationEmail(email: string, data: {
    time: string;
    username: string;
}) {
    const subject = 'New Login to Your Account';
    const text = `
Hello ${data.username},

We detected a new login to your account.

Login Details:
- Time: ${data.time} UTC
- Username: ${data.username}

If this was you, you can ignore this email. If you didn't sign in, please secure your account immediately by changing your password.

Best regards,
Your CIF Team
    `;

    await sendEmail(email, subject, text);
}