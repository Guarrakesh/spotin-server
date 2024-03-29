const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const appRoutes = require('../api/routes/v1');
const adminRoutes = require('../api/routes/admin');
const { logs } = require('./vars');
const strategies = require('./passport');
const error = require('../api/middlewares/error');
const analytics = require('../api/middlewares/analytics');
const configureApolloServer = require('./apollo');
const services = require('./services');
const Container = require('../di/Container');

//const winstonConfig = require('./winston');
/*
 const analyticsMiddleware = (req, res, next) => {
 res.on('finish', function() {

 });
 next();
 }*/
/**
 * Express instance
 * @public
 */
const app = express();

// Container and dependency injection
const container = Container.getInstance();

services.init(container);

app.set('container', container);
// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

//analytics
//app.use(analyticsMiddleware);

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors({
  exposedHeaders: ["X-Total-Count"],

  origin: function(origin, cb) {
    let wl = ['https://spotin-business.herokuapp.com',
      'https://spotin.herokuapp.com',
      'https://spotin.it',
      'http://www.spotin.it',
      'https://www.spotin.it',
      'https://api.spotin.it',
      'https://admin.spotin.it',
      'https://app.spotin.it',
      'https://spotin-prod.herokuapp.com',
      'https://spotin.it',
      'https://spotin-dev.herokuapp.com',
      'https://spotin-staging.herokuapp.com',
      'https://zdmw3jox8g.execute-api.us-east-1.amazonaws.com',
    ];
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "heroku_development" || !origin)
      return cb(null,true);



    if (wl.indexOf(origin) !== -1) {
      cb(null, true);
    } else {
      cb (new Error('invalid origin: ' + origin), false);
    }
  }
}));

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
passport.use('facebook', strategies.facebook);
passport.use('google', strategies.google);

// Analytics stuff
app.use(analytics);

// mount api v1 routes

app.use('/v1', appRoutes);
app.use('/admin', adminRoutes);


// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
//app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

app.use('/graphql', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (user) {
      req.user = user;
    }
    next()
  })(req, res, next);
});
// Apollo GraphQL
const server = configureApolloServer();
server.applyMiddleware({ app, path: '/graphql' });

module.exports = app;

