import ky from 'ky';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { code, redirect_uri } = await request.json();
        const accessToken = await getAccessToken(code, redirect_uri);
        const response = NextResponse.json({ accessToken }, { status: 200 });
        response.cookies.set('token', accessToken as string);
        return response;
    } catch (error: unknown) {
        console.log('Error authenticating', error);
        return NextResponse.json(
            { error: 'Failed to authenticate' },
            { status: 500 },
        );
    }
}

const getAccessToken = async (code: string, redirect_uri: string) => {
    const url = 'https://github.com/login/oauth/access_token';
    const response = await ky.post(url, {
        body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
            client_secret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!,
            code,
            redirect_uri,
        }),
        headers: {
            Accept: 'application/json',
        },
    });
    const textResponse = await response.json();
    return (textResponse as unknown as { access_token: string }).access_token;
};
