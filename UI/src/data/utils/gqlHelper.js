/**
 * https://relay.dev/docs/getting-started/step-by-step-guide/#22-a-fetchgraphql-helper
 */

export const GQL_API_BASE_URL = process.env.REACT_APP_GQL_API_BASE_URL;
export const GQL_CONTEXT = '/task/query';

export async function fetchGraphQL(text, user, variables) {
    const response = await fetch(
        `${GQL_API_BASE_URL}` + `?${user.customParams}`,
        {
            method: 'POST',
            headers: {
                Authorization: `bearer ${user.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: text,
                variables,
            }),
        }
    );

    // Get the response as JSON
    return await response.json();
}
