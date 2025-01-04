import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import * as google from '@googleapis/youtube';
import { Readable } from 'node:stream';
import { getVideo } from '@/utils/supabase';

export async function POST(request: NextRequest) {
    try {
        const { path, title, description, authCode } = await request.json();
        if (!path || !title || !description || !authCode) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const blob = await getVideo(path);
        const buffer = Buffer.from(await blob.arrayBuffer());

        const oauth2Client = new OAuth2Client(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            process.env.NEXT_PUBLIC_REDIRECT_URL
        );
        const { tokens } = await oauth2Client.getToken(authCode);
        oauth2Client.setCredentials(tokens);

        const youtube = google.youtube('v3');
        const response = await youtube.videos.insert({
            auth: oauth2Client,
            part: ['snippet', 'status'],
            requestBody: {
                snippet: {
                    title: title || 'Uploaded Video',
                    description: description || 'Video uploaded via app',
                    categoryId: '22',
                },
                status: {
                    privacyStatus: 'private',
                },
            },
            media: {
                body: Readable.from(buffer),
            },
        });
        return new Response(
            JSON.stringify({
                videoId: response.data.id,
                title: response.data.snippet?.title,
                status: response.data.status?.privacyStatus,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('YouTube upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
