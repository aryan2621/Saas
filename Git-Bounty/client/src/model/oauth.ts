export interface OAuthConfig {
    service: string;
    clientId: string;
    scope: string;
    authUrl: string;
    redirectUri: string;
    extraParams?: Record<string, string>;
}
