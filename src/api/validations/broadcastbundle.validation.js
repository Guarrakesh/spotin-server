const Joi = require('joi');

module.exports = {
  create: {
    body: {
      business:  Joi.alternatives().when('bulkCreate', { is: false, then: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()}),
      bulkCreate: Joi.boolean(),
      start: Joi.date().required(),
      end: Joi.date().required(),
    }
  }
}
