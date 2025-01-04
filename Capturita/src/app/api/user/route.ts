import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUser } from '@/utils/apis/user';
export async function GET(req: NextRequest) {
    const token = req.cookies.get('token');
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const user = jwt.verify(token.value, process.env.NEXT_PUBLIC_JWT_SECRET!) as { id: string; email: string };
        const id = user.id;
        const dbUser = await getUser(id);
        if (!dbUser) {
            throw new Error('You are not authorized to perform this action');
        }
        return NextResponse.json(dbUser, { status: 200 });
    } catch (error) {
        console.error('Error while fetching user', error);
        return NextResponse.json({ message: 'Error while fetching user' }, { status: 500 });
    }
}
