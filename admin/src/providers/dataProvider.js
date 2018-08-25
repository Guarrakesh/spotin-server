import { fetchUtils } from 'react-admin';
import restClientProvider from './restClientProvider';


const apiUrl = process.env.NODE_ENV === "production" ? "/v1" : "http://localhost:3001/v1";
const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({Accept: 'application/json'});
  }

  const token = JSON.parse(localStorage.getItem('token'));
  options.headers.set('Authorization', `Bearer ${token.accessToken}`);
  return fetchUtils.fetchJson(url, options);

};

const dataProvider = restClientProvider(apiUrl, httpClient);

export default dataProvider;
