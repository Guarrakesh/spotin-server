const Joi = require('joi');

const businessHoursValidationSchema = [0,1,2,3,4,5,6].reduce(
    (acc, day) => ({
      ...acc,
      [day]: Joi.alternatives([Joi.boolean(), Joi.object({
        openings: Joi.array().items(Joi.object({open: Joi.number(), close: Joi.number()})).required(),
      })])
    })
);

module.exports = {
  // POST /v1/businesses
  createBusiness: {
    body: {
      type: Joi.alternatives([Joi.array().items(Joi.string()), Joi.string()]).required(),
      address: Joi.alternatives([Joi.object({
        street: Joi.string().required(),
        number: Joi.string().required(),
        zip: Joi.number(),
        city: Joi.string().required(),
        province: Joi.string(),
        country: Joi.string(),
      }),Joi.string()]),
      phone: Joi.string().required(),
      wifi: Joi.boolean(),
      forFamilies: Joi.boolean(),
      target: Joi.string(),
      tvs: Joi.number(),
      seats: Joi.number(),
      providers: Joi.alternatives([Joi.array().items(Joi.string()), Joi.string()]).required(),
      businessHours: businessHoursValidationSchema,
      vat: Joi.number(),
      tradeName: Joi.string()
    }
  },

  // PATCH /v1/businesses/:id
  updateBusiness: {
    body: {
      type: Joi.alternatives([Joi.array().items(Joi.string()), Joi.string()]),
      address: Joi.alternatives([Joi.object({
        street: Joi.string(),
        number: Joi.string(),
        zip: Joi.number().allow(null),
        city: Joi.string(),
        province: Joi.string(),
        country: Joi.string(),
      }), Joi.string()]),
      phone: Joi.string(),
      wifi: Joi.boolean(),
      forFamilies: Joi.boolean(),
      target: Joi.string(),
      tvs: Joi.number(),
      seats: Joi.number(),
      providers: Joi.alternatives([Joi.array().items(Joi.string()), Joi.string()]),
      businessHours: businessHoursValidationSchema,
      vat: Joi.number(),
      tradeName: Joi.string(),
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  }

};
