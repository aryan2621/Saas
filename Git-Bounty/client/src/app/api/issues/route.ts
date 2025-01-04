import { NextResponse } from 'next/server';
import ky from 'ky';
import { cookies } from 'next/headers';

const handleFilters = (filters: URLSearchParams) => {
    const newFilters: Record<string, string> = {};
    filters.forEach((value, key) => {
        if (value) {
            if (value && key !== 'owner' && key !== 'repo') {
                if (key === 'since' || key === 'before') {
                    newFilters[key] = new Date(value).toISOString();
                } else {
                    newFilters[key] = value;
                }
            }
        }
    });
    return newFilters;
};

export async function GET(request: Request) {
    const token = cookies().get('token');
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const filters = handleFilters(searchParams);

    try {
        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 },
            );
        }

        if (!owner || !repo) {
            return NextResponse.json(
                { error: 'Owner and repo are required' },
                { status: 400 },
            );
        }

        const issues = await getRepoIssues(token.value, owner, repo, filters);
        return NextResponse.json(issues);
    } catch (error) {
        console.error('Error fetching issues:', error);
        return NextResponse.json(
            { error: 'Failed to fetch issues' },
            { status: 500 },
        );
    }
}

const getRepoIssues = async (
    token: string,
    owner: string,
    repo: string,
    filters: Record<string, string>,
) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
    const response = await ky.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        searchParams: filters,
    });
    return response.json();
};
