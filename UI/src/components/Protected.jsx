/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein is strictly forbidden, unless permitted by WSO2 in accordance with
 * the WSO2 Commercial License available at http://wso2.com/licenses.
 * For specific language governing the permissions and limitations under
 * this license, please see the license as well as any agreement you’ve
 * entered into with WSO2 governing the purchase of this software and any
 * associated services.
 */

import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useRefreshUser } from '../data/hooks/auth';
import useUser from '../data/hooks/user';
import Loading from './Loading';
import '../styles/Protected.css';

const Protected = (props) => {
    const { children } = props;
    const [user] = useUser();
    const {
        refreshUser,
        error: refreshError,
        loading: isRefreshing,
    } = useRefreshUser();
    useEffect(() => {
        if (!user) {
            refreshUser();
        }
    }, []);
    if (!user && isRefreshing) {
        return (
            <div className='restoring-user-session'>
                <Loading />
                Restoring the user session . . .
            </div>
        );
    }
    if (!user && !isRefreshing && refreshError) {
        return <Redirect to="/login" />;
    }
    return children;
};

export default Protected;
