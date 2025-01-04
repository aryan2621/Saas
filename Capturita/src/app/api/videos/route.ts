import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUserVideos } from '@/utils/apis/video';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token');
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let userId: string;
    try {
        const user = jwt.verify(token.value, process.env.NEXT_PUBLIC_JWT_SECRET!) as { id: string; email: string };
        userId = user.id;
    } catch (error) {
        console.error('Error while verifying token', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const videos = await getUserVideos(userId);
        return NextResponse.json({ videos }, { status: 200 });
    } catch (error) {
        console.error('Error while fetching videos', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
