'use client';

import { getOAuthUrl } from '../utils/oauth';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { OAuthConfig } from '@/model/oauth';

interface OAuthButtonProps {
    config: OAuthConfig;
    onSuccess: (code: string) => void;
    onError: (error: string) => void;
    icon: React.ReactNode;
    isLoading: boolean;
}

export function OAuthButton({ config, onSuccess, onError, icon, isLoading }: OAuthButtonProps) {
    const { toast } = useToast();

    const handleAuthMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
            toast({
                variant: 'destructive',
                title: 'Invalid origin',
                description: 'The message origin is not valid.',
            });
            return;
        }
        if (event.data.type === 'oauth_response' && event.data.code) {
            onSuccess(event.data.code);
            return;
        }
        if (event.data.type === 'oauth_response' && !event.data.code) {
            onError(event.data.error);
            return;
        }
        if (event.data.type === 'oauth_window_closed') {
            onError('The OAuth window was closed.');
            return;
        }
    };

    const initiateOAuth = () => {
        const authUrl = getOAuthUrl(config);
        const authWindow = window.open(authUrl, '_blank', 'width=500,height=600');
        if (!authWindow) {
            toast({
                variant: 'destructive',
                title: 'Pop-up blocked',
                description: 'Please allow pop-ups and try again.',
            });
            return;
        }

        window.addEventListener('message', handleAuthMessage, false);
    };

    return (
        <Button variant={'outline'} className='w-full mb-4' disabled={isLoading} onClick={initiateOAuth}>
            {isLoading ? <span className='loading loading-spinner loading-sm'></span> : <>{icon}</>}
            {isLoading ? `Connecting to ${config.service}` : `Connected to ${config.service}`}
        </Button>
    );
}
