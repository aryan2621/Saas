import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        cookies().delete('token');
        return NextResponse.json({ message: 'Logged out' }, { status: 200 });
    } catch {
        return NextResponse.json(
            { message: 'Failed to log out' },
            { status: 500 },
        );
    }
}
