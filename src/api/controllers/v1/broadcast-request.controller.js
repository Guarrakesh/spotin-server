const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');
const mailer = require('../../utils/nodemailer');
const { Request, TYPE_BROADCAST_REQUEST } = require('../../models/request.model');
const { SportEvent } = require('../../models/sportevent.model');

const { email } = require('../../../config/vars');



exports.create = async (req, res, next) => {
  try {
    const event = await SportEvent.findById(req.body.event);

    if (!event) {
      res.status(httpStatus.NOT_FOUND);
      res.json({status: httpStatus.NOT_FOUND, message: "Questo evento non esiste."})
    }

    const request = new Request();
    request.requestType = TYPE_BROADCAST_REQUEST;
    const { userPosition: position } = req.body;
    const userPosition = {
      type: "Point",
      coordinates: [position.longitude,position.latitude]
    };

    request.broadcastRequest = {
      ...omit(req.body, 'userPosition'),
      userPosition
    };

    await request.save();

    res.status(httpStatus.NO_CONTENT);
    res.json();

  } catch (e) {
    next(e);
  }
};
