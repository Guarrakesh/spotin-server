import {AUTH_CHECK, AUTH_ERROR, AUTH_GET_PERMISSIONS, AUTH_LOGIN, AUTH_LOGOUT} from "react-admin";

const AUTH_GET_USER = 'AUTH_GET_USER';
const loginUri = process.env.NODE_ENV === "production" ? "/admin/auth/login" : "http://192.168.1.5:3001/admin/auth/login";
const refreshUri = process.env.NODE_ENV === "production" ? "/admin/auth/refresh-token" : "http://192.168.1.5:3001/admin/auth/refresh-token";

let isRefreshing = false;
const checkAndRefreshToken = () => {
  return new Promise((resolve, reject) => {

    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) reject();
    //Controllo se la token ha bisogno di refresh

    //Estraggo i millisecondi alla scadenza della token, aspetto quei millisecondi
    //Dopo di ché refresho la token (se fallisce il refresh, faccio il logout (reject) )
    const dateNow = Date.now();
    const tokenExpire = Date.parse(token.expiresIn);
    if (tokenExpire < dateNow) {

      const {email} = JSON.parse(localStorage.getItem('user'));
      const refreshToken = token.refreshToken;
      if (!email) reject();
      const request = new Request(refreshUri, {
        method: 'POST',
        body: JSON.stringify({email, refreshToken}),
        headers: new Headers({'Content-Type': 'application/json'})
      });

      if (isRefreshing) {
        return setTimeout(() => resolve(), 500);
      }


      isRefreshing = true;
      return fetch(request)
          .then(response => {
            if (response.status < 200 || response.status >= 300) {
              return reject(response.statusText);
            }
            return response.json();
          }).then((token) => {
            localStorage.setItem('token', JSON.stringify(token));
            return resolve();
          }).finally(() => {
            isRefreshing = false;
          }).catch(error => reject(error))



    } else {
      resolve();
    }
  });
}
export default (type, params) => {
  switch (type) {
    case AUTH_LOGIN: {

      const {username, password} = params;
      const request = new Request(loginUri, {
        method: 'POST',
        body: JSON.stringify({email: username, password}),
        headers: new Headers({'Content-Type': 'application/json'}),
      });

      return fetch(request)
          .then(response => {
            if (response.status < 200 || response.status >= 300) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then(({token, user}) => {
            localStorage.setItem('token', JSON.stringify(token));
            localStorage.setItem('user', JSON.stringify(user));
          });

    }
    case AUTH_LOGOUT: {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      break;
    }
    case AUTH_ERROR: {
      if (401 === params.status || 403 === params.status) {

        return checkAndRefreshToken()
            .catch(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              return Promise.reject();
            });



      }
      return Promise.resolve();
    }
    case AUTH_CHECK: {
      return checkAndRefreshToken();

    }
    case AUTH_GET_PERMISSIONS: {
      const user = localStorage.getItem('user');

      if (!user) return Promise.reject();

      const role = JSON.parse(user).role;
      return role ? Promise.resolve(role) : Promise.reject();

    }
    case AUTH_GET_USER: {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return Promise.reject();



      return Promise.resolve(user);
    }
    default:
      return Promise.resolve();


  }


}
