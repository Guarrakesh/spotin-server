const mailer = require('.././utils/nodemailer');
const { email } = require('../../config/vars');
module.exports = (user, reservation, eventName, businessName) => {
  if (process.env.NODE_ENV !== "development") {
    const data = {
      to: "info@spotin.it",
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
  }

};