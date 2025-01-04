export interface OAuthConfig {
    service: string;
    clientId: string;
    scope: string;
    authUrl: string;
    extraParams?: Record<string, string>;
}

export interface UserInfo {
    id: string;
    email: string;
    name: string;
    verified_email: boolean;
    given_name: string;
    family_name: string;
    picture: string;
}
