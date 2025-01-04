import { OAuthConfig } from '@/model/oauth';

export const githubOAuthConfig: OAuthConfig = {
    service: 'GitHub',
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    scope: 'repo user',
    authUrl: 'https://github.com/login/oauth/authorize',
    redirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
    extraParams: {
        allow_signup: 'true',
    },
};
