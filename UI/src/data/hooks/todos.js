/**
 * These hooks are DEPRECATED ⚠️ ⛔️ , Look `tasks.js` for newer version of this.
 */
import { useEffect, useState } from 'react';
import useUser from './user';

export function useTodos() {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const [user, generateCustomQueries] = useUser();

    const refetch = async (status = {}) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/todos` + `?${generateCustomQueries()}`,
                {
                    headers: { Authorization: `bearer ${user.accessToken}` },
                }
            );
            const data = await response.json();
            if (status.stale !== true) {
                setData(data);
            }
        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        let status = { stale: false };
        refetch(status);
        return () => {
            status.stale = true;
        };
    }, []);
    return { data, isLoading, error, refetch, setData };
}
