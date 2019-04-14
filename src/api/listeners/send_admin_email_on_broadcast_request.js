const mailer = require('.././utils/nodemailer');
const { email } = require('../../config/vars');
module.exports = (user, event, request) => {
  if (process.env.NODE_ENV !== "development") {
    const data = {
      to: "info@spotin.it",
      from: email.noreplyMail,
      template: 'admin-broadcast-request-notify',
      subject: "Richiesta Broadcast | Spot In",
      context: {
        user,
        event,
        request,
      }
    };
    mailer.sendMail(data);
  }
};