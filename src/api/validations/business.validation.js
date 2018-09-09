const Joi = require('joi');


module.exports = {
  // POST /v1/businesses
  createBusiness: {
    body: {
      type: Joi.array().items(Joi.string()).required(),
      address: Joi.object({
        street: Joi.string().required(),
        number: Joi.string().required(),
        zip: Joi.number(),
        city: Joi.string().required(),
        province: Joi.string(),
        country: Joi.string(),
      }),
      phone: Joi.string().required(),
      wifi: Joi.boolean(),
      forFamilies: Joi.boolean(),
      target: Joi.string(),
      tvs: Joi.number(),
      seats: Joi.number(),
      providers: Joi.array().items(Joi.string()).required(),
      businessHours: Joi.object({
        closingDay: Joi.array().items(Joi.number()),
        hours: Joi.object({
          opening1: Joi.string().required(), closing1: Joi.string(),
          opening2: Joi.string().required(), closing2: Joi.string()
        })
      }),
      vat: Joi.number().required(),
      tradeName: Joi.string()
    }
  },

  // PATCH /v1/businesses/:id
  updateBusiness: {
    body: {
      type: Joi.array().items(Joi.string()),
      address: Joi.object({
        street: Joi.string(),
        number: Joi.string(),
        zip: Joi.number().allow(null),
        city: Joi.string(),
        province: Joi.string(),
        country: Joi.string(),
      }),
      phone: Joi.string(),
      wifi: Joi.boolean(),
      forFamilies: Joi.boolean(),
      target: Joi.string(),
      tvs: Joi.number(),
      seats: Joi.number(),
      providers: Joi.array().items(Joi.string()),
      businessHours: Joi.object({
        closingDay: Joi.array().items(Joi.number()),
        hours: Joi.object({
          opening1: Joi.string().required(), closing1: Joi.string(),
          opening2: Joi.string().required(), closing2: Joi.string()
        })
      }),
      vat: Joi.number(),
      tradeName: Joi.string(),
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  }

};
