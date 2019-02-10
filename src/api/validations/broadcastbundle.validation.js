const Joi = require('joi');

module.exports = {
  create: {
    body: {
      business:  Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      start: Joi.date().required(),
      end: Joi.date().required(),
    }
  }
}
