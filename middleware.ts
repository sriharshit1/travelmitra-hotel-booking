import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    const protectedPaths = ['/dashboard', '/book', '/api/bookings/create'];
    const adminPaths = ['/admin', '/api/admin'];

    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));
    const isAdminPath = adminPaths.some(path => req.nextUrl.pathname.startsWith(path));

    if (isProtectedPath || isAdminPath) {
        if (!token) {
            if (req.nextUrl.pathname.startsWith('/api/')) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', req.url));
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jose.jwtVerify(token, secret);

            const role = payload.role as string;

            if (isAdminPath && role !== 'admin') {
                if (req.nextUrl.pathname.startsWith('/api/')) {
                    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
                }
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }

            const requestHeaders = new Headers(req.headers);
            requestHeaders.set('x-user-id', payload.userId as string);
            requestHeaders.set('x-user-role', role);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

        } catch (error) {
            if (req.nextUrl.pathname.startsWith('/api/')) {
                return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/book/:path*', '/admin/:path*', '/api/bookings/:path*', '/api/admin/:path*'],
};
