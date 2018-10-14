/* eslint-disable camelcase */
const axios = require('axios');

exports.facebook = async (access_token) => {



  // https://graph.facebook.com/v2.9/me?access_token={accessToken}&fields=name%20,email,picture.width(300),id
  const fields = 'id, name, email, picture.width(320)';
  const url = 'https://graph.facebook.com/me';
  const params = { access_token, fields };
  const response = await axios.get(url, { params });
  const {
    id, name, email, picture,
  } = response.data;
  return {
    service: 'facebook',
    picture: picture.data.url,
    id,
    name,
    email,
  };
};

  exports.google = async (access_token) => {


  const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  const params = { access_token };
  const response = await axios.get(url, { params });
  const {
    sub, name, email, picture,
  } = response.data;
  return {
    service: 'google',
    picture,
    id: sub,
    name,
    email
  };
};
