// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from './../lib/jwt';

// export function middleware(req: NextRequest) {
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader) {
//         return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//         return NextResponse.json({ message: 'Token missing' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//         return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
//     }

//     // Token is valid, allow the request to proceed
//     req.headers.set('userId', decoded.userId);
//     return NextResponse.next();
// }

// export const config = {
//     matcher: '/api/protected/:path*', // Protect all routes under /api/protected
// };


import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    const protectedRoutes = ['/protected-route', '/dashboard']; // Add protected routes here

    // Check if the request is for a protected route
    if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        try {
            // Verify the token
            jwt.verify(token, process.env.JWT_SECRET!);
            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/protected-route/:path*', '/dashboard/:path*'], // Paths to apply middleware
};