import { useState } from 'react';
import { API_BASE_URL } from './tasks';
import useUser from './user';

export function useAddGroup() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('initial');
    const [error, setError] = useState();
    const [user, generateCustomQueries] = useUser();

    const addGroup = async (newGroup, { onSuccess }) => {
        setIsLoading(true);
        setData(null);
        try {
            const response = await fetch(
                `${API_BASE_URL}/groups` + `?${generateCustomQueries()}`,
                {
                    headers: {
                        Authorization: `bearer ${user.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    body: JSON.stringify(newGroup), // body data type must match "Content-Type" header
                }
            );
            if (!response.ok) {
                setError(response);
                console.error(response);
                setStatus('error');
            }
            const data = await response.json();
            setData(data);
            setStatus('success');
            onSuccess(data);
        } catch (error) {
            setError(error);
            console.error(error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };
    return {
        addGroup,
        data,
        isLoading,
        error,
        isSuccess: status === 'success',
        isError: status === 'error',
    };
}

export function useDeleteGroup() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('initial');
    const [error, setError] = useState();
    const [user, generateCustomQueries] = useUser();

    const deleteGroup = async (groupId, { onSuccess }) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/groups/${groupId}` +
                    `?${generateCustomQueries()}`,
                {
                    headers: {
                        Authorization: `bearer ${user.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                }
            );
            if (!response.ok) {
                setError(response);
                console.error(response);
                setStatus('error');
            }
            setStatus('success');
            onSuccess(groupId);
        } catch (error) {
            setError(error);
            console.error(error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };
    return {
        deleteGroup,
        isLoading,
        error,
        isSuccess: status === 'success',
        isError: status === 'error',
    };
}
