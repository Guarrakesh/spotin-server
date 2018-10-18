const mongoose = require('mongoose');
const httpStatus = require('http-status');

const moment = require('moment-timezone');


const { slugify } = require('lodash-addons');
const { imageVersionSchema } = require('./imageVersion');
const pointSchema = require('./point.schema');

const broadcastRequestSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  maxDistance: {
    type: Number,
  },
  numOfPeople: {
    type: Number,
  },
  userPosition: {
    type: pointSchema,
  },
  note: {
    type: String,
    maxlength: 250
  }
});
const contactRequestSchema = new mongoose.Schema({
  name: {

    type: String,
    maxlength: 128,
    index: true,
    trim: true
  },
  email: {

    type: String,
    maxlength: 128,
    index: true,
    trim: true
  },
  message: {

    type: String,
    maxlength: 400
  },
});


const requestSchema = new mongoose.Schema({

  contactRequest: {
    type: contactRequestSchema,
    default: null
  },
  requestType: {
    type: Number,
    default: 0,
    //0 - Default request, 1 - Broadcast Request
  },
  broadcastRequest: {
    type: broadcastRequestSchema,
    default: null
  }


}, { minimize: false });

exports.requestSchema = requestSchema;
exports.TYPE_BROADCAST_REQUEST = 1;
exports.TYPE_CONTACT_REQUEST = 0;

exports.Request = mongoose.model('ContactRequest', requestSchema);
