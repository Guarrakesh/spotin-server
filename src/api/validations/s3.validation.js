const Joi = require('joi');

module.exports = {
  // POST /v1/auth/register
  register: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
      username: Joi.string().min(6).max(128),
      name: Joi.string().required().min(2).max(128),

    },
  },
  signUrl: {

  }
};
