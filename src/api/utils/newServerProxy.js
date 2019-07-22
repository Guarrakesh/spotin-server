const axios = require('axios');
const mongoose = require('mongoose');

const USERNAME = "admin@spotin.it";
const PASSWORD = "SpotIn-Nana-2018";
const URL_MAPPING = {
  development: "https://spotin2-dev.herokuapp.com",
  staging: "https://spotin2-staging.herokuapp.com",
  production: "https://spotin2.herokuapp.com",
  test: 'http://localhost:3009',
};
const URL = URL_MAPPING[process.env.NODE_ENV];

const TokenModel = mongoose.model('Token', new mongoose.Schema({}, { strict: false }), 'tokens');
class NewServerProxy {

  constructor() {
    if (!NewServerProxy.__instance) {
      NewServerProxy.__instance = this;
    }
    return NewServerProxy.__instance;
  }


  static getInstance() {
    if (!NewServerProxy.__instance) {
      return new NewServerProxy();
    }
    return NewServerProxy.__instance;
  }

  async post(endpoint, data) {
    return axios.post(`${URL}/${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${(await this.getToken()).accessToken}`
      }
    })
  }

  async storeToken(newToken, oldToken = undefined, userId) {
    if (oldToken) {
      const result = await TokenModel.findOneAndUpdate({accessToken: oldToken.accessToken}, {...newToken, userId});
    } else {
      await TokenModel.create({...newToken, userId});
    }
    this.currentToken = {...newToken, userId};
  }

  async refreshToken(token) {
    try {
      const userId = token.userId;
      const response = await axios.post(`${URL}/auth/refresh`, {
        refreshToken: token.refreshToken,
        userId,
      }, {headers: {Authorization: `Bearer ${token.accessToken}`}});
      const newToken = response.data;
      await this.storeToken(newToken, token, userId);
      return newToken;
    } catch (e) {
      console.log(e);
    }
  }

  async login() {
    const response = await axios.post(`${URL}/auth/login`, {
      email: USERNAME,
      password: PASSWORD
    });
    if (response.data.token) {
      await this.storeToken(response.data.token, undefined, response.data.user._id);
    }
    return this.currentToken;
  }
  async getToken() {
    let token = this.currentToken ? this.currentToken : await TokenModel.findOne().lean();
    if (!token) {
      // token non esiste, login
      token = await this.login();
    } else if (token) {
      if (token.expiresIn < Date.now()) {
        // Token scaduta, refresh
        token = this.refreshToken(token);
      }
    }
    return token;
  }
}

module.exports = {
  NewServerProxy,
  TokenModel,
};