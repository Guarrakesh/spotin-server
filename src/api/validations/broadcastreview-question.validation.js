const Joi = require('joi');

module.exports = {
  create: {
    body: {
      text: Joi.string().required(),
      multiplier: Joi.number().default(1),
      order: Joi.number().default(1),
      offeredAnswers: Joi.array().items(
          Joi.object({
            value: Joi.number().required(),
            text: Joi.string().required(),
          })
      ).required().min(1)
    }
  },

  update: {
    body: {
      text: Joi.string(),
      multiplier: Joi.number(),
      order: Joi.number(),
      offeredAnswers: Joi.array().items(
          Joi.object({
            value: Joi.number(),
            text: Joi.string(),
          })
      ).min(1)
    }

  }

};