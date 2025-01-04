import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname?.toLowerCase();
    const publicPaths = ['/login'];
    const isPublicPath = publicPaths.includes(path);
    const token = request.cookies?.get('token');

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/', '/login', '/user'],
};
