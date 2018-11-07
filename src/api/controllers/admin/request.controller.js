const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');
const mailer = require('../../utils/nodemailer');

const { email } = require('../../../config/vars');
const { Request, TYPE_CONTACT_REQUEST, TYPE_BROADCAST_REQUEST } = require('../../models/request.model.js');


exports.list = async (req, res, next) => {
  try {
    const requests = await Request.list(req.query);

    res.json(requests);
  } catch (e) {
    next(e);
  }
}
;

exports.get = async (req, res, next) => {

  try {
    const request = await Request.findById(req.params.id);
    res.json(request);
  } catch (e) {
    next(e);
  }
};
