import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // Define protected routes
    const protectedRoutes = [
        '/search',
        '/profile',
        '/dashboard'
    ];

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // Verify token
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            await jwtVerify(token, secret);

            return NextResponse.next();
        } catch (error) {
            // Token is invalid - clear it and redirect to login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/search/:path*',
        '/profile/:path*',
        '/dashboard/:path*',
    ]
};