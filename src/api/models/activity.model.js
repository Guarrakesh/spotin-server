// @flow

const mongoose = require('mongoose');
const pointSchema = require('./point.schema');

const ACTIVITY_TYPES = {
  VIEW: 'view',
  GET_OFFER_COMPLETE: 'get_offer',
  GET_OFFER_CANCEL: 'get_offer_cancel',
  CANCEL_OFFER: 'cancel_offer',
  FAVORITE_SET: 'favorite_set',
  FAVORITE_SKIP: 'favorite_skip',

};
const activity = new mongoose.Schema({
  entityType: String,
  entityId: mongoose.Schema.ObjectId,
  activityType: {
    type: String,
    required: true
  },
  activityParams: new mongoose.Schema({}, { strict: false, _id: false }),
  meta: new mongoose.Schema({
    location: new mongoose.Schema({}, { strict: false, _id: false }),
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }
  }, { _id: false, strict: false })
}, { timestamps: true });


activity.index({  createdAt: 1 , 'meta.user': 1 }, { sparse: true });
activity.index({  createdAt: 1, entityId: 1, 'meta.location': '2dsphere' }, { sparse: true });
exports.ACTIVITY_TYPES = ACTIVITY_TYPES;
exports.Activity = mongoose.model('Activity', activity, 'activities');
