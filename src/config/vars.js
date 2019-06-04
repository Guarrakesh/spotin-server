const path = require('path');

// import .env variables
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== "staging") {
  require('dotenv').load({
    allowEmptyValues: true,
    path: path.join(__dirname, process.env.NODE_ENV === "test" ? '../../.env.test' : '../../.env'),


  });
}

console.log(path.join(__dirname, process.env.NODE_ENV === "test" ? '../../.env.test' : '../../.env'));
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.NODE_ENV == "development" ?  15 : process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri: process.env.MONGO_URI || process.env.MONGO_URI_TESTS
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  s3WebsiteEndpoint: 'https://dockaddkf7nie.cloudfront.net',
  s3Region: process.env.AWS_S3_REGION,

  //Mailer
  mailerEmailID: "info@spotin.it",
  mailerPassword: "Nana2018",
  mailerPort: 465,
  mailerHost: "smtps.aruba.it",
  //mailerSecure: true,

  email: {
    noreplyMail: 'noreply@spotin.it',
    infoMail: 'info@spotin.it'
  }
};

