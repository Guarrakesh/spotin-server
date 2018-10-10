const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');

const ADMIN = 'admin';
const APP_USER = 'user';
const BUSINESS = 'business';


const handleJWT = (req, res, next, roles) => async (err, user, info) => {

  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) throw error;
    await logIn(user, { session: false });
    req.locals = Object.assign({}, req.locals, {loggedUser: user});
  } catch (e) {
    return next(apiError);
  }



  const { loggedUser } = req.locals;
  //Check x-client-type header
  //Se l'utente loggato non è business e ho una richiesta con x-client-type=business (cioè sto nel pannello business)
  //allora lo butto fuori

  if (req.get('x-client-type') && loggedUser.role !== "business") {
    return next(apiError);
  }
  if (loggedUser.role === ADMIN) {
    req.user = user;
    return next();
  }

  if ((typeof roles === "object" && !roles.includes(loggedUser.role)) ||
      (typeof roles === "string" && roles !== loggedUser.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  } else if (err || !user) {
    return next(apiError);
  }



  req.user = user;

  return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = APP_USER;
exports.BUSINESS = BUSINESS;


exports.authorize = (roles = User.roles) => (req, res, next) =>

  passport.authenticate(
    'jwt', { session: false },
    handleJWT(req, res, next, roles),
  )(req, res, next);

exports.oAuth = service =>
  passport.authenticate(service, { session: false });
