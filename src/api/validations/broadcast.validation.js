const Joi = require('joi');

module.exports = {
  createBroadcast: {
    body: {
      event:  Joi.string().required(),
      business: Joi.string().required(),
      start_at: Joi.date(),
      end_at: Joi.date(),
      offer: Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        value: Joi.number().default(10),
        type: Joi.number().default(1)
      }).required(),
      plus: Joi.boolean().default(false)

    }
  }
}
