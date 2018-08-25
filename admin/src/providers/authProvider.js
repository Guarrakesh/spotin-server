import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK, AUTH_ERROR, AUTH_GET_PERMISSIONS  } from 'react-admin';


const loginUri = process.env.NODE_ENV === "production" ? "/v1/auth/login" : "http://localhost:3001/v1/auth/login";
const refreshUri = process.env.NODE_ENV === "production" ? "/v1/auth/refresg" : "http://localhost:3001/v1/auth/refresh-token";


export default (type, params) => {
  switch (type) {
    case AUTH_LOGIN:

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


    case AUTH_LOGOUT:
      localStorage.removeItem('token');
      break;
    case AUTH_ERROR:
      if (401 === params.status || 403 === params.status) {
        localStorage.removeItem('token');
        return Promise.reject();
      }
      return Promise.resolve();

      break;



    case AUTH_CHECK:
      const token = JSON.parse(localStorage.getItem('token'));
      if (!token) Promise.reject();
      //Controllo se la token ha bisogno di refresh

      //Estraggo i millisecondi alla scadenza della token, aspetto quei millisecondi
      //Dopo di ché refresho la token (se fallisce il refresh, faccio il logout (reject) )
      const dateNow = Date.now();
      const tokenExpire = Date.parse(token.expiresIn);
      console.log(tokenExpire);
      if (tokenExpire < dateNow) {

        const { email } = JSON.parse(localStorage.getItem('user'));
        const refreshToken = token.refreshToken;
        if (!email) Promise.reject();
        const request = new Request(refreshUri, {
          method: 'POST',
          body: JSON.stringify({email, refreshToken}),
          headers: new Headers({'Content-Type': 'application/json'})});
        return fetch(request)
          .then(response => {
            if (response.status < 200 || response.status >= 300) {
              throw new Error(response.statusText);
            }
            return response.json();
          }).then((token) => {
            localStorage.setItem('token', JSON.stringify(token));

          });

      } else {

        Promise.resolve();
      }


    case AUTH_GET_PERMISSIONS:
      const { role } = JSON.parse(localStorage.getItem('user'));
      return role ? Promise.resolve(role) : Promise.reject();

    default:
      return Promise.resolve();
  }


}
