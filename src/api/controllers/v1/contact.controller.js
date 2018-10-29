const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');
const mailer = require('../../utils/nodemailer');

const { email } = require('../../../config/vars');
const { Request, TYPE_CONTACT_REQUEST } = require('../../models/request.model.js');


exports.create = async (req, res, next) => {
  try {
    const request = new Request();

    request.requestType = TYPE_CONTACT_REQUEST;
    request.contactRequest = {
      ...req.body
    };

    const savedRequest = await request.save();
    const data = {
      to: user.email,
      from: email.noreplyMail,
      template: 'password-reset',
      subject: "Reset Password | Spot In",
      context: {
        url: 'https://spotin.it/password-reset?token=' + user.passwordResetToken,
        name: user.name,
        email: user.email
      }
    };
    await mailer.sendMail(data);

    res.status(httpStatus.CREATED);
    res.json(savedRequest);

  } catch (e) {
    next(e);
  }
}
;
