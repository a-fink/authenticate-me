import Cookies from 'js-cookie';

export async function csrfFetch(url, options={}){
    // set method property on options to the incomming method, or GET if none is specified
    options.method = options.method || 'GET';
    // set the headers property on options to the incomming headers, or to {} if not specified
    options.headers = options.headers || {};

    // if method is not GET then we need to send headers with the XSRF-TOKEN & make the type "application/json" if none is specified
    if(options.method.toUpperCase() !== 'GET'){
        options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    // call the window's fetch method with the url and the updated options object
    const res = await window.fetch(url, options);

    // if response code is 400 or above, throw an error with the response
    if(res.status >= 400) throw res;

    // if response is under 400 then we can return the response to the next promise chain
    return res;
}

// in development we need to get the XSRF-TOKEN from the backend (in dev frontend / backend are two separate servers)
// should only be used in DEVELOPMENT
export function restoreCSRF(){
    return csrfFetch('/api/csrf/restore');
}
