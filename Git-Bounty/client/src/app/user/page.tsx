'use client';

import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Github,
    Trophy,
    Wallet,
    Award,
    Clock,
    Target,
    Loader2,
} from 'lucide-react';
import BasicLayout from '@/layout/basic-layout';
import NotUserFound from './not-user-found';
import UserLoader from './loader';
import ky from 'ky';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export interface GitUser {
    avatar_url: string;
    bio: string | null;
    blog: string;
    collaborators: number;
    company: string;
    created_at: string;
    disk_usage: number;
    email: string | null;
    followers: number;
    following: number;
    location: string;
    login: string;
    name: string;
    public_repos: number;
    total_private_repos: number;
    twitter_username: string | null;
    type: string;
}

const fetchUser = async (): Promise<GitUser> => {
    const response = await ky.get('/api/me').json<GitUser>();
    return response;
};

const logOut = async () => {
    return await ky.get('/api/logout');
};

export default function Component() {
    const router = useRouter();

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery<GitUser>({
        queryKey: ['user'],
        queryFn: fetchUser,
    });
    const { isPending: isLoggingOut } = useMutation({
        mutationFn: logOut,
        onSuccess: () => {
            router.push('/login');
        },
    });

    if (isLoading) {
        return (
            <BasicLayout>
                <UserLoader />
            </BasicLayout>
        );
    }

    if (isError || !user) {
        return (
            <BasicLayout>
                <NotUserFound />
            </BasicLayout>
        );
    }

    const accountAge =
        new Date().getFullYear() - new Date(user.created_at).getFullYear();

    return (
        <BasicLayout>
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="flex items-start gap-6 mb-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                            {user.name?.charAt(0) || user.login.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold">
                                {user.name || user.login}
                            </h1>
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                <Github className="h-3 w-3" />
                                {user.login}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            {user.bio || 'No bio provided'}
                        </p>
                        <div className="flex gap-4">
                            {user.company && (
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-1"
                                >
                                    <Award className="h-3 w-3" />
                                    {user.company}
                                </Badge>
                            )}
                            {user.location && (
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-1"
                                >
                                    <Trophy className="h-3 w-3" />
                                    {user.location}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <Button
                        disabled={isLoggingOut}
                        onClick={() => {
                            logOut();
                        }}
                    >
                        {isLoggingOut ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            'Logout'
                        )}
                    </Button>
                </div>

                <Tabs defaultValue="contributions" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="contributions">
                            Contributions
                        </TabsTrigger>
                        <TabsTrigger value="repositories">
                            Repositories
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="contributions">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Statistics</CardTitle>
                                    <CardDescription>
                                        Your GitHub activity and engagement
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">
                                                    Following Ratio
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {Math.round(
                                                        (user.following /
                                                            (user.followers ||
                                                                1)) *
                                                            100,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <Progress
                                                value={Math.min(
                                                    Math.round(
                                                        (user.following /
                                                            (user.followers ||
                                                                1)) *
                                                            100,
                                                    ),
                                                    100,
                                                )}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Trophy className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {user.followers}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Followers
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Wallet className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {user.following}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Following
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Overview</CardTitle>
                                    <CardDescription>
                                        Account status and activity
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {accountAge} years
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Account Age
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {user.public_repos +
                                                            user.total_private_repos}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Total Repos
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {user.twitter_username && (
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        Twitter
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        @{user.twitter_username}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {user.blog && (
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        Website
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.blog}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="repositories">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Repository Statistics</CardTitle>
                                    <CardDescription>
                                        Overview of your repositories
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">
                                                    Public Ratio
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {Math.round(
                                                        (user.public_repos /
                                                            (user.public_repos +
                                                                user.total_private_repos)) *
                                                            100,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <Progress
                                                value={Math.round(
                                                    (user.public_repos /
                                                        (user.public_repos +
                                                            user.total_private_repos)) *
                                                        100,
                                                )}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Trophy className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {user.public_repos}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Public Repos
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Wallet className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {
                                                            user.total_private_repos
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Private Repos
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </BasicLayout>
    );
}
