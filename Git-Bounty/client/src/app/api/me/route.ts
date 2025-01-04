import { NextResponse } from 'next/server';
import ky from 'ky';
import { cookies } from 'next/headers';

export async function GET() {
    const token = cookies().get('token');
    try {
        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 },
            );
        }
        const user = await getUser(token.value);
        return NextResponse.json(user);
    } catch (error) {
        console.log('Error fetching user data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data' },
            { status: 500 },
        );
    }
}

const getUser = async (token: string) => {
    const url = 'https://api.github.com/user';
    const response = await ky.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.json();
};
