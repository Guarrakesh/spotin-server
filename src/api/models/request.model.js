const mongoose = require('mongoose');
const httpStatus = require('http-status');

const moment = require('moment-timezone');

const mongoosePaginate = require('mongoose-paginate');
const { slugify } = require('lodash-addons');
const { imageVersionSchema } = require('./image');
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
  location: String,
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


}, { minimize: false, timestamps: { createdAt: 'created_at'} });


requestSchema.statics = {
  async list(options) {
    const { _end = 10, _start = 0, _order = -1, _sort = "created_at", id_like, q, ...filter } = options;

    if (id_like) filter.id = { $in: id_like.split('|') };
    return await this.paginate(filter, {
      sort: {[_sort]: _order === "DESC" ? -1 : 1},
      offset: parseInt(_start),
      limit: parseInt(_end - _start)
    })
  }
};

requestSchema.plugin(mongoosePaginate);
exports.requestSchema = requestSchema;
exports.TYPE_BROADCAST_REQUEST = 1;
exports.TYPE_CONTACT_REQUEST = 0;

exports.Request = mongoose.model('ContactRequest', requestSchema);
