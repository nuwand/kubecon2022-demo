export const getCookie = (key) => {
    const name = `${key}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
};

export const setCookie = (
    name,
    value,
    validityPeriod,
    path = '/',
    secured = true
) => {
    let expiresDirective = '';
    const securedDirective = secured ? '; Secure' : '';
    if (validityPeriod) {
        const date = new Date();
        if (validityPeriod < 0) {
            date.setTime(date.getTime() + 1000000000000);
        } else {
            date.setTime(date.getTime() + validityPeriod * 1000);
        }
        expiresDirective = '; expires=' + date.toUTCString();
    }

    document.cookie = `${name}=${value}; path=${path}${expiresDirective}${securedDirective}`;
};

export const deleteCookie = (key) => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
