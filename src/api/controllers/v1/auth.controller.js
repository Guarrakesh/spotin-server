const httpStatus = require('http-status');
const User = require('../../models/user.model.js');
const RefreshToken = require('../../models/refreshToken.model.js');
const moment = require('moment-timezone');
const { jwtExpirationInterval } = require('../../../config/vars');
const ApiError = require('../../utils/APIError');
const mailer = require('../../utils/nodemailer');

const { email } = require('../../../config/vars');

const { LOGGED_USER } = require('../../middlewares/auth');
/**
* Returns a formated object with tokens
* @private
*/
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const user = await (new User(req.body)).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {

    const xClientType = req.get('X-Client-Type');
    const { user, accessToken } = await User.findAndGenerateToken(req.body, xClientType);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const xClientType = req.get('X-client-type');
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject }, xClientType === "business");
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};


exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email, role: LOGGED_USER});
    if (!user) return next(new ApiError({status: 404, message: "User not found."}));

    user.passwordResetToken = await user.resetToken();
    await user.save();

    // Send Email
    const data = {
      to: user.email,
      from: email.noreplyMail,
      template: 'password-reset',
      subject: "Reset Password | Spot In",
      context: {
        url: 'https://spotin.it/password-reset?token=' + user.passwordResetToken,
        name: user.name,
        email: user.email
      }
    };
    await mailer.sendMail(data);
    res.status(200);
    res.json({message: "Email sent. Check your email fort further instructions.", token: user.passwordResetToken});
  } catch (error) {
    return next(error);
  }
};


exports.resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({passwordResetToken: req.body.token});
    if (!user) return next(new ApiError({status: 401, message: "Invalid or expired token."}));

    user.password = req.body.password;
    user.passwordResetToken = null;
    await user.save();

    res.json(user.transform());

  } catch (error) {
    return next(error);
  }
};
