import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export const verifyAuth = async (req: NextRequest) => {
    try {
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return null;
        }

        const decoded = verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            email: string;
        };

        return decoded;
    } catch (error) {
        return null;
    }
};