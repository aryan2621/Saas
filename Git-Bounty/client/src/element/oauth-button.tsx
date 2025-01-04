'use client';
import { OAuthConfig } from '@/model/oauth';
import { getOAuthUrl } from '@/utils/oauth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { OAuthMessage } from '@/app/oauth/page';

interface OAuthHandlerProps {
    config: OAuthConfig;
    onSuccess: (response: OAuthMessage) => void;
    onError: (error: string) => void;
    icon?: React.ReactNode;
}

export function OAuthHandler({
    config,
    onSuccess,
    onError,
    icon,
}: OAuthHandlerProps) {
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
        if (event.data.type === 'oauth_response' && event.data.code?.trim()) {
            onSuccess(event.data);
            return;
        }
        if (event.data.type === 'oauth_response' && !event.data.code?.trim()) {
            onError(event.data.error);
            return;
        }
        if (event.data.type === 'oauth_window_closed') {
            onError('The OAuth window was closed.');
            return;
        }
    };

    const initiateOAuth = () => {
        const state = crypto.randomUUID();
        const authUrl = getOAuthUrl(config, state);
        const authWindow = window.open(
            authUrl,
            '_blank',
            'width=500,height=600',
        );
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
        <Button
            variant={'outline'}
            className="w-full mb-4"
            onClick={initiateOAuth}
        >
            {icon}
            Connect to {config.service}
        </Button>
    );
}
