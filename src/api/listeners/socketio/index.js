const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;

const checkoutSocket = require('./checkout');
const { jwtSecret } = require('../../../config/vars');
const { jwtVerify } = require('../../../config/passport');
/**
 *
 * @param {Server} io
 */
const socketHandlers = (io) => {

  io.use((socket, accept) => {
    const strategy = new JwtStrategy({
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token')
    }, jwtVerify);
    strategy.success = (user) => {
      socket.request.user = user;
      accept();
    };
    strategy.fail = info => accept(new Error(info));
    strategy.error = error => accept(error);
    strategy.authenticate(socket.request, {});
  });

  io.on('connection', function (socket) {
    checkoutSocket(socket, io);
  });
};

module.exports = socketHandlers;
