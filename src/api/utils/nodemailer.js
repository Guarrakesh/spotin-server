const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const {  mailerEmailID, mailerPassword, mailerPort, mailerHost, mailerSecure } = require('../../config/vars');


const smtpTransport = nodemailer.createTransport({
  port: mailerPort,
  host: mailerHost,
  secure: true,
  auth: { user: mailerEmailID, pass: mailerPassword }
});

const handlebarsOptions = {
  //viewEngine: 'handlebars',
  viewEngine: {
    extName: '.html',
    partialsDir: './src/email/tmp',
    viewPath:  path.resolve("./src/email/"),
  },
  partialsDir: './src/email/tmp',
  viewPath:  path.resolve("./src/email/"),
  extName: ".html"
};

smtpTransport.use('compile', hbs(handlebarsOptions));


module.exports = smtpTransport;

