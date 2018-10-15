const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');

const ADMIN = 'admin';
const APP_USER = 'user';
const BUSINESS = 'business';


/**
 *
 * @param req
 * @param res
 * @param next
 * @param roles
 * @param ownerCallback La funzione che, se data, controlla se l'utente loggato è il proprietario di questa risorsa.
 *                      Se non lo è, restituisce un 401 - Unauthorized
 */
const handleJWT = (req, res, next, roles, ownerCallback) => async (err, user, info) => {

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
  //Stesso discorso se ho una richiesta da mobileapp e l'utente non è "user"

  const xClientType = req.get('x-client-type');
  if ((xClientType === "business" && loggedUser.role !== BUSINESS) || (xClientType === "mobileapp" && loggedUser.role !== APP_USER)) {
    return next(apiError);
  }

  if (ownerCallback && !ownerCallback(req, loggedUser)) {

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


exports.authorize = (roles = User.roles, ownerCallback) => (req, res, next) =>

  passport.authenticate(
    'jwt', { session: false },
    handleJWT(req, res, next, roles, ownerCallback),
  )(req, res, next);

exports.oAuth = service =>
  passport.authenticate(service, { session: false });
