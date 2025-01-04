import { NextResponse } from 'next/server';
import ky from 'ky';
import { cookies } from 'next/headers';

const handleFilters = (filters: URLSearchParams) => {
    const newFilters: Record<string, string> = {};
    filters.forEach((value, key) => {
        if (value) {
            if (key === 'since' || key === 'before') {
                newFilters[key] = new Date(value).toISOString();
            } else {
                newFilters[key] = value;
            }
        }
    });
    return newFilters;
};

export async function GET(request: Request) {
    const token = cookies().get('token');
    const { searchParams } = new URL(request.url);
    const filters = handleFilters(searchParams);
    try {
        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 },
            );
        }
        const repos = await getUserRepos(token.value, filters);
        return NextResponse.json(repos);
    } catch (error) {
        console.log('Error fetching user repos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user repos' },
            { status: 500 },
        );
    }
}

const getUserRepos = async (token: string, filters: Record<string, string>) => {
    const url = 'https://api.github.com/user/repos';
    const response = await ky.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        searchParams: filters,
    });
    return response.json();
};
