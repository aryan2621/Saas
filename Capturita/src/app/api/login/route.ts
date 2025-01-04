import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import ky from 'ky';
import jwt from 'jsonwebtoken';
import { UserInfo } from '@/model/oauth';
import { isUserExists } from '@/utils/apis/user';
import { createUser } from '@/utils/apis/user';
import { User } from '@/model/user';

export async function POST(request: NextRequest) {
    try {
        const { authCode } = await request.json();
        const oauth2Client = new OAuth2Client(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            process.env.NEXT_PUBLIC_REDIRECT_URL
        );
        const { tokens } = await oauth2Client.getToken(authCode);
        if (!tokens?.access_token) {
            return NextResponse.json({ error: 'No access token' }, { status: 400 });
        }
        const userInfo: UserInfo = await getUserInfo(tokens.access_token);
        const isRequestedUserExists = await isUserExists(userInfo.email);
        if (!isRequestedUserExists) {
            await createUser(
                new User({
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                })
            );
        }
        const token = jwt.sign({ id: userInfo.id, email: userInfo.email }, process.env.NEXT_PUBLIC_JWT_SECRET!, {
            expiresIn: '1d',
        });
        const response = NextResponse.json(userInfo, { status: 200 });
        response.cookies.set('token', token, {
            httpOnly: true,
            maxAge: 86400,
            expires: new Date(Date.now() + 86400),
        });
        return response;
    } catch (error) {
        console.error('Error while logging in', error);
        return NextResponse.json({ error: 'Login error' }, { status: 400 });
    }
}
async function getUserInfo(token: string): Promise<UserInfo> {
    const response = await ky.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return (await response.json()) as UserInfo;
}
