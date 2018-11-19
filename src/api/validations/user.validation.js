const Joi = require('joi');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/users
  listUsers: {
    query: {
      _end: Joi.number().min(1),
      _order: Joi.string(),
      _sort: Joi.string(),
      _start: Joi.number().min(0),

      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(User.roles),
    },
  },

  // POST /v1/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      lastname: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
      username: Joi.string().min(6).max(128)
    },
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().required().max(128),
      lastname: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
      username: Joi.string().min(6).max(128)
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      username: Joi.string().min(6).max(128),
      email: Joi.string().email(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
      lastname: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  //Favorite events
  addFavoriteEvent: {
    body: {
      event: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()

    }
  },
  removeFavoriteEvent: {
    params: {
      eventId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()

    }
  },

  listFavoriteEvents: {
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
    }
  },
  getReservation: {
    params: {
      reservationId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
    }
  },
  listReservations: {
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
    }
  },
  reserveBroadcast: {
    body: {
      broadcast: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
    }
  },

  removeReservation: {
    params: {
      reservationId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // Broadcast Request

  requestBroadcast: {
    body: {
      event: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      maxDistance: Joi.number().required(),
      numOfPeople: Joi.number().required(),
      userPosition: Joi.object({latitude: Joi.number(), longitude: Joi.number()}).required(),
      location: Joi.string().required().max(128),
      note: Joi.string().allow('').max(250),
    },
  },
};
