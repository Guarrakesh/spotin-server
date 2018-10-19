const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');

const { Request, TYPE_CONTACT_REQUEST } = require('../../models/request.model.js');


exports.create = async (req, res, next) => {
  try {
    const request = new Request();

    request.requestType = TYPE_CONTACT_REQUEST;
    request.contactRequest = {
      ...req.body
    };

    const savedRequest = await request.save();


    res.status(httpStatus.CREATED);
    res.json(savedRequest);

  } catch (e) {
    next(e);
  }
}
;
