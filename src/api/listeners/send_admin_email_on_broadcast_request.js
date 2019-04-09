const mailer = require('.././utils/nodemailer');
const { email } = require('../../config/vars');
module.exports = (user, event, request) => {
  const data = {
    to: "dario.guarracino2@gmail.com",
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
};