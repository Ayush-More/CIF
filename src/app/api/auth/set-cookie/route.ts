import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json({ message: 'Token missing' }, { status: 400 });
    }

    const response = NextResponse.redirect(new URL('/', req.url)); // or any dashboard route
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
    });

    return response;
}