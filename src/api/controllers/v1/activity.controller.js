const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');
const mailer = require('../../utils/nodemailer');

const { email } = require('../../../config/vars');
const { Activity } = require('../../models/activity.model');


exports.create = async (req, res, next) => {
  try {

    const { body, user } = req;

    const activity = new Activity(body);
    if (user && user.id) {
      activity.meta = {
        ...activity.meta,
        user: user._id,
      }
    }
    if (body.meta.location && body.meta.location.latitude && body.meta.location.longitude) {
      activity.meta.location = {
        type: 'Point',
        coordinates: [body.meta.location.longitude, body.meta.location.latitude]
      }
    };
    await activity.save();

    res.status(httpStatus.CREATED);
    res.json({ message: 'OK'});

  } catch (e) {
    next(e);
  }
}
;

exports.list  = async (req, res, next) => {
  try {
    res.json({});
  } catch (e) {
    next(e);
  }
};


exports.get  = async (req, res, next) => {
  try {
    res.json({});
  } catch (e) {
    next(e);
  }
};
