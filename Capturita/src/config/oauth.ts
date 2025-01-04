import { OAuthConfig } from '@/model/oauth';

export const googleOAuthConfig: OAuthConfig = {
    service: 'Google',
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    scope: 'profile email',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    extraParams: {
        access_type: 'offline',
        prompt: 'consent',
    },
};
