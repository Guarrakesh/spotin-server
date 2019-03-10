const Joi = require('joi');

const { ACTIVITY_TYPES } = require('../models/activity.model');

module.exports = {
  create: {
    body: {
      activityType: Joi.valid(Object.values(ACTIVITY_TYPES)).required(),
      activityParams: Joi.object().unknown(true),
      entityType: Joi.string(),
      entityId: Joi.string(),
      meta: Joi.object().keys({
        location: Joi.object({latitude: Joi.any(), longitude: Joi.any()}),
        user: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
      }).unknown(true)

    }
  }
};