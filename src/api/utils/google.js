const axios = require('axios');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise,
});

const verifyRecaptchaV3 = async (token, remoteIp) => {
  return axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=6Lf1_qUUAAAAAJ41Fgc-lq0TG0EwvY_ipLivZ870
        &response=${token}&remoteIp=${remoteIp}`,
      {},
      {
        headers: {
          'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
        }
      });
};

exports.googleMapsClient = googleMapsClient;
exports.verifyRecaptchaV3 = verifyRecaptchaV3;