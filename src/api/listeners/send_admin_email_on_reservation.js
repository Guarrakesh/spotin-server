const mailer = require('.././utils/nodemailer');
const { email } = require('../../config/vars');
module.exports = (user, reservation, eventName, businessName) => {
  const data = {
    to: "dario.guarracino2@gmail.com",
    from: email.noreplyMail,
    template: 'admin-reservation-notify',
    subject: "Nuova Prenotazione | Spot In",
    context: {
      user,
      reservation,
      eventName,
      businessName,
    }
  };
  mailer.sendMail(data);
};