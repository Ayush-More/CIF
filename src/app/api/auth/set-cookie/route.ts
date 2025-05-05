// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//     const { token } = await req.json();

//     if (!token) {
//         return NextResponse.json({ message: 'Token missing' }, { status: 400 });
//     }

//     const response = NextResponse.json({ success: true });

//     // Set the cookie with proper options
//     response.cookies.set('token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         path: '/',
//         maxAge: 7 * 24 * 60 * 60, // 7 days
//     });

//     return response;
// }

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();
        console.log('Received token:', token);

        if (!token) {
            console.error('Token missing in request');
            return NextResponse.json({ message: 'Token missing' }, { status: 400 });
        }

        // Create the response with proper headers
        const response = new NextResponse(
            JSON.stringify({ message: 'Login successful', success: true }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        // Set the cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        console.log('Cookie set with value:', token);
        return response;
    } catch (error) {
        console.error('Error setting cookie:', error);
        return NextResponse.json(
            { message: 'Error setting cookie' },
            { status: 500 }
        );
    }
}