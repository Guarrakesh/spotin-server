const path = require('path');

// import .env variables
require('dotenv').load({
  allowEmptyValues: true,
  path: path.join(__dirname, '../../.env'),

});


module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.NODE_ENV == "development" ?  0.5 : process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : process.env.MONGO_URI,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
