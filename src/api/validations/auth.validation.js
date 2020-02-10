const Joi = require('joi');

module.exports = {
  // POST /v1/auth/register
  register: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
      username: Joi.string().min(6).max(128),
      name: Joi.string().required().min(2).max(128),
      referrerId: Joi.string(),

    },
  },

  // POST /v1/auth/login
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().max(128),
    },
  },

  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: {
    body: {
      access_token: Joi.string().required(),
      referrerId: Joi.string(),
    },
  },

  // POST /v1/auth/refresh-token
  refresh: {
    body: {
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required(),
    },
  },

  forgotPassword: {
    body: {
      email: Joi.string().email().required(),
    }
  },
  resetPassword: {
    body: {
      token: Joi.string().length(40).required(),
      password: Joi.string().required().min(6).max(128)
    }
  }
};
