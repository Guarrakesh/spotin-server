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
      from: email.noreplyMail,
      template: 'contact-request',
      subject: "Richiesta di Contatto | Spot In",
      context: {
        ...req.body,
        date: new Date().toLocaleString(),
      },
      to: ["info@spotin.it", "dario.guarracino2@gmail.com", "armando.catalano91@gmail.com", "delbalzo95@gmail.com"]

    };
    await mailer.sendMail(data);

    res.status(httpStatus.CREATED);
    res.json(savedRequest);

  } catch (e) {
    next(e);
  }
}
;
