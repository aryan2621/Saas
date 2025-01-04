'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { State } from '@/model/state';

interface OAuthState {
    isLoading: boolean;
    error: string | null;
    errorDescription: string | null;
    errorUri: string | null;
}

export interface OAuthMessage {
    type: 'oauth_response';
    code: string;
    state: string | null;
}

const REQUIRED_PARAMS = [
    'authUrl',
    'client_id',
    'scope',
    'redirect_uri',
] as const;
type RequiredParam = (typeof REQUIRED_PARAMS)[number];

const ERROR_PARAMS = ['error', 'error_description', 'error_uri'] as const;
type ErrorParam = (typeof ERROR_PARAMS)[number];

const ERROR_CODES_TO_MESSAGES: Record<string, string> = {
    authorization_pending: 'The authorization request is pending.',
    interaction_required:
        'The authorization request requires user interaction.',
    login_required: 'The authorization request requires user login.',
    account_selection_required:
        'The authorization request requires user account selection.',
    consent_required: 'The authorization request requires user consent.',
    access_denied: 'The authorization request was denied by the user.',
    invalid_request:
        'The request is missing required parameters or is malformed.',
    unauthorized_client:
        'The client is not authorized to request authorization.',
    unsupported_response_type:
        'The authorization server does not support obtaining an authorization code using this method.',
    invalid_scope: 'The requested scope is invalid, unknown, or malformed.',
    server_error: 'The authorization server encountered an unexpected error.',
    temporarily_unavailable:
        'The authorization server is temporarily unavailable.',
};

export default function Component() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [{ isLoading, error, errorDescription, errorUri }, setState] =
        useState<OAuthState>({
            isLoading: false,
            error: null,
            errorDescription: null,
            errorUri: null,
        });

    const validateParams = useCallback((): [
        boolean,
        Record<RequiredParam, string>,
    ] => {
        const params: Partial<Record<RequiredParam, string>> = {};
        const missingParams: string[] = [];

        for (const param of REQUIRED_PARAMS) {
            const value = searchParams?.get(param);
            if (!value) {
                missingParams.push(param);
            } else {
                params[param] = value;
            }
        }

        if (missingParams.length > 0) {
            throw new Error(
                `Missing required parameters: ${missingParams.join(', ')}`,
            );
        }

        return [true, params as Record<RequiredParam, string>];
    }, [searchParams]);

    const validateErrorParams = useCallback((): [
        boolean,
        Record<ErrorParam, string>,
    ] => {
        const params: Partial<Record<ErrorParam, string>> = {};
        for (const param of ERROR_PARAMS) {
            const value = searchParams?.get(param);
            if (value) {
                params[param] = value;
            }
        }
        return [
            Object.keys(params).length > 0,
            params as Record<ErrorParam, string>,
        ];
    }, [searchParams]);

    const initiateOAuth = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const [isValid, params] = validateParams();
            if (!isValid) {
                throw new Error(
                    `Missing required parameters: ${REQUIRED_PARAMS.join(
                        ', ',
                    )}`,
                );
            }

            const httpParams = new URLSearchParams({
                client_id: params.client_id,
                redirect_uri: params.redirect_uri,
                response_type: 'code',
                scope: params.scope,
                state: crypto.randomUUID(),
            });

            searchParams?.forEach((value, key) => {
                if (
                    !REQUIRED_PARAMS.includes(key as RequiredParam) &&
                    key !== 'service'
                ) {
                    httpParams.set(key, value);
                }
            });

            const fullAuthUrl = `${params.authUrl}?${httpParams.toString()}`;
            router.push(fullAuthUrl);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to initialize OAuth flow';
            setState((prev) => ({
                ...prev,
                error: errorMessage,
                isLoading: false,
                errorDescription:
                    'There was a problem setting up the authentication process.',
                errorUri: null,
            }));
        }
    }, [router, searchParams, validateParams]);

    const handleError = useCallback(
        (errorCode: string) => {
            setState((prev) => ({ ...prev, isLoading: false }));
            try {
                const [, params] = validateErrorParams();
                const errorMessage =
                    ERROR_CODES_TO_MESSAGES[errorCode] ||
                    `Authentication error: ${errorCode}`;
                setState((prev) => ({
                    ...prev,
                    error: errorMessage,
                    errorDescription:
                        params.error_description ||
                        'No additional details available.',
                    errorUri: params.error_uri,
                }));
            } catch {
                setState((prev) => ({
                    ...prev,
                    error: 'An unexpected error occurred during authentication.',
                    errorDescription:
                        'Please try again or contact support if the problem persists.',
                    errorUri: null,
                }));
            }
        },
        [validateErrorParams],
    );

    const sendAuthCodeToParent = useCallback(
        (authCode: string) => {
            const state = new State();

            try {
                if (!window.opener) {
                    throw new Error('Parent window not found');
                }

                const message: OAuthMessage = {
                    type: 'oauth_response',
                    code: authCode,
                    state: searchParams?.get('state') ?? null,
                };

                window.opener.postMessage(message, '*');
                state.successState();
                requestAnimationFrame(() => {
                    setTimeout(() => window.close(), 2000);
                });
            } catch (error) {
                state.errorState('connection_failed');
                setState((prev) => ({
                    ...prev,
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Failed to communicate with parent window',
                    errorDescription:
                        'The authentication window could not communicate with the main application.',
                }));
            }
        },
        [searchParams],
    );

    useEffect(() => {
        const errorCode = searchParams?.get('error');
        const code = searchParams?.get('code');

        if (errorCode) {
            handleError(errorCode);
        } else if (code) {
            sendAuthCodeToParent(code);
        } else if (!error) {
            initiateOAuth();
        } else {
            const state = new State();
            state.errorState('connection_failed');
        }
    }, [error, handleError, initiateOAuth, searchParams, sendAuthCodeToParent]);

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                {isLoading && (
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </div>
                )}

                {error && (
                    <div className="space-y-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Authentication Error</AlertTitle>
                            <AlertDescription className="mt-2">
                                {error}
                            </AlertDescription>
                            {errorDescription && (
                                <AlertDescription className="mt-2 text-sm opacity-90">
                                    {errorDescription}
                                </AlertDescription>
                            )}
                            {errorUri && (
                                <AlertDescription className="mt-2 text-sm">
                                    <a
                                        href={errorUri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        More information
                                    </a>
                                </AlertDescription>
                            )}
                        </Alert>

                        <div className="flex gap-2">
                            <Button disabled className="flex-1">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Retrying...
                                    </>
                                ) : (
                                    'Authentication Failed. Go Back and Try Again'
                                )}
                            </Button>
                            <Button
                                onClick={() => window.close()}
                                variant="outline"
                                className="flex-1"
                            >
                                Close Window
                            </Button>
                        </div>
                    </div>
                )}

                {!error && !isLoading && (
                    <Alert>
                        <AlertTitle>Authentication in Progress</AlertTitle>
                        <AlertDescription>
                            Please wait while we complete the authentication
                            process...
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
