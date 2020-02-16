const checkoutSocket = require('./checkout');

/**
 *
 * @param {Server} io
 */
const socketRoutes = (io) => {

  checkoutSocket(io);
};

module.exports = socketRoutes;
