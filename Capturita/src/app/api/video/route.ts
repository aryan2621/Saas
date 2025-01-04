import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Video } from '@/model/video';
import { createVideo } from '@/utils/apis/video';
export async function POST(request: NextRequest) {
    const token = request.cookies.get('token');
    try {
        if (!token) {
            throw new Error('You are not authorized to perform this action');
        }
        const { path } = await request.json();
        const user = jwt.verify(token.value, process.env.NEXT_PUBLIC_JWT_SECRET!) as { id: string; email: string };
        const video = new Video({
            userId: user.id,
            path: path,
        });
        console.log(video);
        await createVideo(video);
        return NextResponse.json({ message: 'Video uploaded successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error while uploading video for user', error);
        return NextResponse.json({ message: 'Error while uploading video for user' }, { status: 500 });
    }
}
