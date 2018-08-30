const Joi = require('joi');

module.exports = {
  createCompetitor: {
    body: Joi.object({
      sport: Joi.string().required(),
      name: Joi.any()
        .when('first_name' ,{
          is : Joi.exist(), then: Joi.string().max(128).allow(''), otherwise: Joi.string().max(128).required()
        }),

      slug: Joi.string().allow(""),
      first_name: Joi.string().max(64),
      last_name: Joi.any()
        .when('name', {
          is: Joi.exist(), then: Joi.string().max(64).allow(''), otherwise: Joi.string().max(64).required()
        }),
      full_name: Joi.string().max(128),
      isPerson: Joi.boolean()

    })
  },

  updateCompetitor: {
    body: Joi.object({
      sport: Joi.string(),
      name: Joi.string().max(128),

      slug: Joi.string().allow(""),
      first_name: Joi.string().max(64),
      last_name: Joi.string().max(64),
      full_name: Joi.string().max(128),
      isPerson: Joi.boolean()

    })
  },

  listCompetitors: {
    query: {
      _end: Joi.number().min(1),
      _order: Joi.string(),
      _sort: Joi.string(),
      _start: Joi.number().min(0),
    }
  }
}
