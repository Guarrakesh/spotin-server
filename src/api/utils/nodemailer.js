const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const {  mailerEmailID, mailerPassword, mailerPort, mailerHost, mailerSecure } = require('../../config/vars');


const smtpTransport = nodemailer.createTransport({
  port: mailerPort,
  host: mailerHost,
  secure: mailerSecure,
  auth: { user: mailerEmailID, pass: mailerPassword }
});

const handlebarsOptions = {
  viewEngine: 'handlebars',
  partialsDir: './src/email/tmp',
  viewPath:  path.resolve("./src/email/"),
  extName: ".html"
};

smtpTransport.use('compile', hbs(handlebarsOptions));


module.exports = smtpTransport;

