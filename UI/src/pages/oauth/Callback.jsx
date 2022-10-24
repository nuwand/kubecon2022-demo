import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Banner from '../../components/Banner/Banner';
import { useAsgardeoToken } from '../../data/hooks/auth';
import { setCookie } from '../../data/utils/cookies';

import '../../styles/Callback.css';
import CallbackItem from './CallbackItem';

export default function Callback(params) {
    const {
        isAsgardeoLoading,
        isChoreoTokenLoading,
        choreoTokenData,
        asgardeoStatus,
        choreoStatus,
        asgardeoError,
        choreoError,
        asgardeoTokenData,
    } = useAsgardeoToken();
    const history = useHistory();
    useEffect(() => {
        if (choreoTokenData) {
            setCookie(
                'id_token',
                choreoTokenData.id_token,
                choreoTokenData.expires_in
            );
            setCookie('refresh_token', choreoTokenData.refresh_token, 86400);
            setCookie(
                'access_token',
                choreoTokenData.access_token,
                choreoTokenData.expires_in
            );
            history.push('/');
        }
    }, [choreoTokenData]);

    useEffect(() => {
        if (asgardeoTokenData) {
            setCookie(
                'asgardeo_id_token',
                asgardeoTokenData.id_token,
                asgardeoTokenData.expires_in
            );
        }
    }, [asgardeoTokenData]);
    const getAsgardeoStatus = () => {
        let status = 'loading';
        if (isAsgardeoLoading) {
            status = 'loading';
        }
        if (asgardeoStatus === 'success') {
            status = 'success';
        }
        if (asgardeoError) {
            status = 'error';
        }
        return status;
    };

    const getChoreoStatus = () => {
        let status = 'loading';
        if (isChoreoTokenLoading) {
            status = 'loading';
        }
        if (choreoStatus === 'success') {
            status = 'success';
        }
        if (asgardeoError) {
            status = 'error';
        }
        return status;
    };
    return (
        <div className="callback-layout">
            <ul>
                <li>
                    <CallbackItem
                        text="Requesting Asgardeo token"
                        status={getAsgardeoStatus()}
                    />
                    {asgardeoError && <Banner error={asgardeoError}/>}
                </li>
                <li>
                    <CallbackItem
                        text="Requesting Choreo token"
                        status={getChoreoStatus()}
                    />

                    {choreoError && <Banner error={choreoError}/>}
                </li>
            </ul>
        </div>
    );
}
