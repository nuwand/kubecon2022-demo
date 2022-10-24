import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { parseJwt } from '../utils/auth';
import { deleteCookie, getCookie } from '../utils/cookies';

const customParams = (user) => ({
    'x-choreo-user-email': user.email,
    'x-choreo-user-sid': user.sid,
});

export default function useUser() {
    const accessToken = getCookie('access_token');
    const history = useHistory();
    const memonizedUser = useMemo(() => {
        let user = null;
        if (accessToken) {
            const idToken = getCookie('id_token');
            const asgardeoIdToken = getCookie('asgardeo_id_token');
            const { given_name, picture, email, sid, ...otherClaims } =
                parseJwt(idToken);
            user = {
                logout: () => {
                    deleteCookie('access_token');
                    deleteCookie('refresh_token');
                    deleteCookie('id_token');
                },
                idToken,
                asgardeoIdToken,
                accessToken,
                given_name,
                picture,
                email,
                sid,
                customParams: new URLSearchParams({ email, sid }).toString(),
            };
        }
        return user;
    }, [accessToken]);
    const generateCustomParams = () => {
        if (memonizedUser) {
            const queryPrams = new URLSearchParams(customParams(memonizedUser));
            return queryPrams.toString();
        } else {
            return '';
        }
    };
    return [memonizedUser, generateCustomParams];
}