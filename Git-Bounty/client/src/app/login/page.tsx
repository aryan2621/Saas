'use client';

import { githubOAuthConfig } from '@/config/oauth';
import { OAuthHandler } from '@/element/oauth-button';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Github, Trophy } from 'lucide-react';
import ky from 'ky';
import { OAuthMessage } from '../oauth/page';
import { useRouter } from 'next/navigation';

export default function Component() {
    const { toast } = useToast();
    const router = useRouter();
    const handleSuccess = async (data: OAuthMessage) => {
        try {
            await ky.post('/api/auth', {
                json: {
                    code: data.code,
                    redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
                },
            });
            toast({
                title: 'Success',
                description:
                    'You have successfully authenticated with GitHub, redirecting to home page',
            });
            router.push('/');
        } catch {
            toast({
                title: 'Error',
                description: 'There was an error authenticating with GitHub',
                variant: 'destructive',
            });
        }
    };

    const handleError = () => {
        toast({
            title: 'Error',
            description: 'There was an error authenticating with GitHub',
            variant: 'destructive',
        });
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 animate-fade-in">
                        Welcome to Bounty Platform
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto">
                        Connect your wallet or authenticate with GitHub to start
                        earning or creating bounties
                    </p>
                </div>

                <Card className="p-8 hover:scale-105 transition-all duration-300">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="p-4 rounded-full">
                            <Trophy className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-semibold">
                            Bounty Placer
                        </h2>
                        <p className="text-center text-lg">
                            Create and manage bounties for your projects.
                            Connect with talented developers and get your work
                            done.
                        </p>
                        <OAuthHandler
                            config={githubOAuthConfig}
                            onSuccess={handleSuccess}
                            onError={handleError}
                            icon={<Github className="h-4 w-4" />}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
