const Joi = require('joi');

module.exports = {
  useCoupon: {
    body: {
      code: Joi.string().required(),
    }
  }
}