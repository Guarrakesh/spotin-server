const Joi = require('joi');
const { Sport } = require('../models/sport.model');


module.exports = {
  // POST /v1/sports
  createCompetition: {
    body: {
      name: Joi.string().min(6).max(128).required(),
      country: Joi.string().max(128)
    }
  },

  // PATCH /v1/sports/:sportId
  updateCompetition: {
    body: {

      name: Joi.string().min(6).max(128),
      country: Joi.string().max(128)
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  }

};
