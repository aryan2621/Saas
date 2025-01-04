'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { AlertCircle, GitFork, Star, ExternalLink } from 'lucide-react';
import BasicLayout from '@/layout/basic-layout';
import SearchComponent, { SearchFilters } from '@/element/search-filters';
import { useQuery } from '@tanstack/react-query';

type Repo = {
    id: number;
    name: string;
    description?: string;
    stargazers_count: number;
    forks_count: number;
    html_url: string;
    owner: {
        login: string;
    };
};

const fetchRepos = async (filters: Partial<SearchFilters>): Promise<Repo[]> => {
    const response = await fetch(
        `/api/repos?${new URLSearchParams(
            filters as unknown as Record<string, string>,
        )}`,
    );
    if (!response.ok) throw new Error('Failed to fetch repositories');
    return response.json();
};

export default function Home() {
    const [filters, setFilters] = useState<Partial<SearchFilters>>({
        per_page: 50,
        sort: 'created',
    });
    const router = useRouter();

    const {
        data: repos,
        isLoading,
        isError,
    } = useQuery<Repo[]>({
        queryKey: ['repos', filters],
        queryFn: () => fetchRepos(filters),
    });

    const handleFiltersChange = (newFilters: SearchFilters) =>
        setFilters(newFilters);

    return (
        <BasicLayout>
            <SearchComponent
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
            />
            <div className="container mx-auto p-4 max-w-4xl">
                {isError && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                        role="alert"
                    >
                        <span className="flex items-center">
                            <AlertCircle className="mr-2" />
                            Failed to fetch repositories. Please check the
                            filters and try again.
                        </span>
                    </div>
                )}
                {isLoading ? (
                    <p className="text-center text-lg">
                        Loading repositories...
                    </p>
                ) : (
                    repos &&
                    repos.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {repos.map((repo) => (
                                <Card key={repo.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="text-xl">
                                            {repo.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-gray-600 mb-4">
                                            {repo.description ||
                                                'No description available'}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4" />
                                                {repo.stargazers_count}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <GitFork className="w-4 h-4" />
                                                {repo.forks_count}
                                            </span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.push(
                                                    `/issue/${repo.name}?owner=${repo.owner.login}&repo=${repo.name}`,
                                                )
                                            }
                                        >
                                            View Issues
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                window.open(
                                                    repo.html_url,
                                                    '_blank',
                                                )
                                            }
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            GitHub
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )
                )}
            </div>
        </BasicLayout>
    );
}
