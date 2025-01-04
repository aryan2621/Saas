import { OAuthConfig } from '@/model/oauth';

export function getOAuthUrl(config: OAuthConfig, state: string): string {
    const params = new URLSearchParams();
    params.set('authUrl', config.authUrl);
    params.set('client_id', config.clientId);
    params.set('scope', config.scope);
    params.set('prompt', 'select_account');
    params.set('redirect_uri', config.redirectUri);
    params.set('service', config.service);
    params.set('state', state);
    if (config.extraParams) {
        for (const [key, value] of Object.entries(config.extraParams)) {
            params.set(key, value);
        }
    }
    return config.redirectUri + `?${params.toString()}`;
}
