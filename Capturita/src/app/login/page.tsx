'use client';

import { googleOAuthConfig } from '@/config/oauth';
import { OAuthButton } from '@/elements/oAuthButton';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import ky from 'ky';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/context/user';
import { User } from '@/model/user';

export default function LoginWithGoogle() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);

    const handleLogin = async (authCode: string) => {
        try {
            setIsLoading(true);
            const response = await ky.post('/api/login', {
                json: {
                    authCode,
                    plan: 'basic',
                },
            });
            const user = (await response.json()) as User;
            setUser(user);
            toast.success('Login successful!');
            router.push('/');
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred while logging in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container mx-auto w-60'>
            <div className='flex min-h-screen flex-col items-center justify-center'>
                <OAuthButton
                    config={googleOAuthConfig}
                    onSuccess={handleLogin}
                    onError={(e) => {
                        console.error('Login error:', e);
                        toast.error('Failed to log in. Please try again.');
                    }}
                    icon={<FcGoogle className='mr-2 h-4 w-4' />}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
