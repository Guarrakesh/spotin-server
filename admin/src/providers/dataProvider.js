import { fetchUtils } from 'react-admin';
import restClientProvider from './restClientProvider';
import addUploadFeature from './fileUpload';


const apiUrl = process.env.NODE_ENV === "production" ? "/v1" : "http://192.168.1.51:3001/v1";
const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({Accept: 'application/json'});
  }

  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) return Promise.reject("No Auth Token");
  options.headers.set('Authorization', `Bearer ${token.accessToken}`);
  return fetchUtils.fetchJson(url, options);

};

const dataProvider = addUploadFeature(restClientProvider(apiUrl, httpClient));

export default dataProvider;
