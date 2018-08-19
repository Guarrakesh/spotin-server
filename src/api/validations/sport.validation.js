const Joi = require('joi');
const { Sport } = require('../models/sport.model');


module.exports = {
  // POST /v1/sports
  createSport: {
    body: {
      name: Joi.string().min(6).max(128).required(),
      slug: Joi.string().max(128),
      active: Joi.boolean(),
    }
  },
  // PUT /v1/sports/:sportId
  replaceSport: {
    body: {
      name: Joi.string().min(6).max(128).required(),
      slug: Joi.string().max(128),
      active: Joi.boolean(),
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
  // PATCH /v1/sports/:sportId
  updateSport: {
    body: {
      name: Joi.string().min(6).max(128),
      slug: Joi.string().max(128),
      active: Joi.boolean(),
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  }

};
