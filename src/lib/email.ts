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