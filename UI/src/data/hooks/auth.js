import React, { useState, useEffect, useCallback } from 'react';

import {
    ASGARDEO_STATE_SUFFIX_CHOREO,
    generateCodeVerifier,
    generateHash,
} from '../utils/auth';
import { default as asgardeoSdkConfig } from '../../data/configs/asgardeo.json';
import { useLocation } from 'react-router-dom';
import { getCookie, setCookie } from '../utils/cookies';

const signInRedirectURL = `${window.location.origin}/oauth/callback`;

export const useAuthRequestURL = () => {
    const [codeChallenge, setCodeChallenge] = useState(null);

    useEffect(() => {
        (async () => {
            const codeVerifier = generateCodeVerifier();
            const newCodeChallenge = await generateHash(codeVerifier);
            sessionStorage.setItem('pkce_code_verifier#0', codeVerifier);
            setCodeChallenge(newCodeChallenge);
        })();
    }, []);

    const getAuthRequestURL = useCallback(
        (configs = {}) => {
            const {
                endpoints: { authorizationEndpoint },
                clientID,
                scope,
            } = asgardeoSdkConfig;
            const { state } = configs;
            return (
                `${authorizationEndpoint}?response_type=code&client_id=${clientID}` +
                `&scope=${scope.join('+')}&redirect_uri=${signInRedirectURL}` +
                `&response_mode=query&code_challenge_method=S256&code_challenge=${codeChallenge}` +
                `&state=${state}${ASGARDEO_STATE_SUFFIX_CHOREO} : ''}`
            );
        },
        [codeChallenge]
    );

    return { getAuthRequestURL, codeChallenge };
};

export const useAsgardeoToken = () => {
    const [asgardeoTokenData, setAsgardeoData] = useState();
    const [isAsgardeoLoading, setAsgardeoIsLoading] = useState(true);
    const [asgardeoError, setAsgardeoError] = useState();
    const [asgardeoStatus, setAsgardeoStatus] = useState('initial');

    const [choreoTokenData, setChoreoToken] = useState();
    const [isChoreoTokenLoading, setIsChoreoTokenLoading] = useState(true);
    const [choreoError, setChoreoError] = useState();
    const [choreoStatus, setChoreoStatus] = useState('initial');

    const {
        endpoints: { tokenEndpoint },
        clientID,
        stsTokenEndpoint,
        stsConfig,
    } = asgardeoSdkConfig;

    const { search } = useLocation();
    const sessionState = new URLSearchParams(search).get('session_state');
    const oauthCode = new URLSearchParams(search).get('code');
    useEffect(() => {
        if (oauthCode) {
            (async () => {
                setAsgardeoIsLoading(true);
                const formBody = new URLSearchParams({
                    client_id: clientID,
                    code: oauthCode,
                    grant_type: 'authorization_code',
                    redirect_uri: signInRedirectURL,
                    code_verifier: sessionStorage.getItem(
                        'pkce_code_verifier#0'
                    ),
                });

                try {
                    const response = await fetch(tokenEndpoint, {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                        },
                        body: formBody,
                        method: 'POST',
                        mode: 'cors',
                        credentials: 'omit',
                    });
                    if (!response.ok) {
                        setAsgardeoError(response);
                        console.error(response);
                        setAsgardeoStatus('error');
                    } else {
                        const data = await response.json();
                        setAsgardeoData(data);
                        setAsgardeoStatus('success');
                    }
                } catch (error) {
                    setAsgardeoError(error);
                    console.error(error);
                    setAsgardeoStatus('error');
                } finally {
                    setAsgardeoIsLoading(false);
                }
            })();
        }
    }, [oauthCode]);

    useEffect(() => {
        if (asgardeoStatus === 'success') {
            (async () => {
                setIsChoreoTokenLoading(true);
                const { client_id, orgHandle, scope } = stsConfig;
                const { id_token, access_token } = asgardeoTokenData;
                const formBody = new URLSearchParams({
                    client_id: client_id,
                    grant_type:
                        'urn:ietf:params:oauth:grant-type:token-exchange',
                    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
                    scope: scope.join('+'),
                    subject_token: id_token,
                    orgHandle,
                });
                try {
                    const response = await fetch(stsTokenEndpoint, {
                        headers: {
                            authorization: `Bearer ${id_token}`,
                            'content-type': 'application/x-www-form-urlencoded',
                        },
                        body: formBody,
                        method: 'POST',
                        mode: 'cors',
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        setChoreoError(response);
                        console.error(response);
                        setChoreoStatus('error');
                    } else {
                        const data = await response.json();
                        setChoreoToken(data);
                        setChoreoStatus('success');
                    }
                } catch (error) {
                    setChoreoError(error);
                    console.error(error);
                    setChoreoStatus('error');
                } finally {
                    sessionStorage.removeItem('pkce_code_verifier#0');
                    setIsChoreoTokenLoading(false);
                }
            })();
        }
    }, [asgardeoStatus]);
    return {
        asgardeoTokenData,
        isAsgardeoLoading,
        asgardeoError,
        asgardeoStatus,
        choreoTokenData,
        isChoreoTokenLoading,
        choreoError,
        choreoStatus,
    };
};

export const useRefreshUser = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { stsTokenEndpoint, stsConfig } = asgardeoSdkConfig;

    const refreshUser = useCallback(async () => {
        setLoading(true);
        const { client_id, orgHandle, scope } = stsConfig;
        const idToken = getCookie('id_token');
        const refresh_token = getCookie('refresh_token');
        if(!refresh_token) {
            setError('No refresh token found');
            setLoading(false);
            return;
        }
        const formBody = new URLSearchParams({
            client_id: client_id,
            grant_type: 'refresh_token',
            refresh_token,
            orgHandle,
        });

        try {
            const response = await fetch(stsTokenEndpoint, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: formBody,
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
            });

            if (!response.ok) {
                setError(response);
                console.error(response);
            } else {
                const choreoTokenData = await response.json();
                if (choreoTokenData) {
                    setCookie(
                        'id_token',
                        choreoTokenData.id_token,
                        choreoTokenData.expires_in
                    );
                    setCookie(
                        'refresh_token',
                        choreoTokenData.refresh_token,
                        86400
                    );
                    setCookie(
                        'access_token',
                        choreoTokenData.access_token,
                        choreoTokenData.expires_in
                    );
                }
                setData(choreoTokenData);
            }
        } catch (error) {
            setError(error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);
    return { data, error, loading, refreshUser };
};
