import { fetchUtils } from 'react-admin';
import restClientProvider from './restClientProvider';
import addUploadFeature from './fileUpload';
import authProvider from './authProvider';

const apiUrl = process.env.NODE_ENV === "production" ? "/admin" : "http://localhost:3001/admin";

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({Accept: 'application/json'});
  }


  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) return Promise.reject("No Auth Token");


  options.headers.set('Authorization', `Bearer ${token.accessToken}`);
  return authProvider('AUTH_CHECK')
      .then(() => {
        return fetchUtils.fetchJson(url, options);
      })
      ;


};

const dataProvider = addUploadFeature(restClientProvider(apiUrl, httpClient));

export default dataProvider;
