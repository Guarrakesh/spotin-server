import _ from 'lodash';
import vars from '../vars';

export const fetchApi = (endPoint, payload = {}, method = 'get', header = {}) => {
    // TODO: return fetch
}

export async function request(url, payload, method: 'GET', accessToken = null) {
    let config = {
        method,
        headers: { 'Content-Type': 'application/json' },

    };
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (method !== 'HEAD' && method !== 'GET') {
        config.body = JSON.stringify(payload);
    }

    console.log(config);
    let response = await fetch(url, config);

    return response;


}
