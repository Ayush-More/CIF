// import { NextResponse } from 'next/server';
// import { jwtVerify, JWTPayload } from 'jose';

// interface CustomJWTPayload extends JWTPayload {
//     userId?: string;
//     email?: string;
//     name?: string;
//     exp?: number;
// }

// export async function GET(req: Request) {
//     try {
//         // Get the token from cookies
//         const cookieHeader = req.headers.get('cookie');
//         console.log(cookieHeader, 777777888)
//         const token = cookieHeader?.split('; ')
//             .find(row => row.startsWith('token='))
//             ?.split('=')[1];
//         console.log(token, 99999)

//         if (!token) {
//             return NextResponse.json(
//                 { authenticated: false, message: 'No token found' },
//                 { status: 401 }
//             );
//         }

//         // Verify the token
//         const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//         const { payload } = await jwtVerify(token, secret);
//         const customPayload = payload as CustomJWTPayload;

//         // Check if token is expired
//         if (customPayload.exp && customPayload.exp * 1000 < Date.now()) {
//             return NextResponse.json(
//                 { authenticated: false, message: 'Token expired' },
//                 { status: 401 }
//             );
//         }

//         // Return user data if token is valid
//         return NextResponse.json({
//             authenticated: true,
//             user: {
//                 id: customPayload.userId,
//                 email: customPayload.email,
//                 name: customPayload.name,
//             }
//         });
//     } catch (error) {
//         console.error('Token verification failed:', error);
//         return NextResponse.json(
//             { authenticated: false, message: 'Invalid token' },
//             { status: 401 }
//         );
//     }
// }

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

interface CustomJWTPayload extends JWTPayload {
    userId?: string;
    email?: string;
    name?: string;
    exp?: number;
}

export async function GET(req: NextRequest) {  // Changed to NextRequest
    try {
        // Get the token from cookies using NextRequest's cookies
        const token = req.cookies.get('token')?.value;

        if (!token) {
            console.log('No token found in cookies');
            return NextResponse.json(
                { authenticated: false, message: 'No token found' },
                { status: 401 }
            );
        }

        console.log('Found token in cookies:', token);

        // Verify the token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const customPayload = payload as CustomJWTPayload;

        // Check if token is expired
        if (customPayload.exp && customPayload.exp * 1000 < Date.now()) {
            return NextResponse.json(
                { authenticated: false, message: 'Token expired' },
                { status: 401 }
            );
        }

        // Return user data if token is valid
        return NextResponse.json({
            authenticated: true,
            user: {
                id: customPayload.userId,
                email: customPayload.email,
                name: customPayload.name,
            }
        });
    } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.json(
            { authenticated: false, message: 'Invalid token' },
            { status: 401 }
        );
    }
}