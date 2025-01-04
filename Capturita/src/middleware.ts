import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname?.toLowerCase();
    const publicPaths = ['/login'];
    const isPublicPath = publicPaths.includes(path);
    const token = request.cookies?.get('token');

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);
            await jwtVerify(token.value, secret);
        } catch (error) {
            console.error('Invalid token:', error);
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/login', '/billing', '/contact', '/history', '/', '/settings'],
};
