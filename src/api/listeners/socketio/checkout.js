const Container = require('../../../di/Container');
const { jwt } = require('../../../config/passport');
/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
const checkoutSocket = (socket, io) => {

  const container = Container.getInstance();

  socket.on('init_checkout', (data) => {
    console.log(socket.request.user ? "true" : "false", data);
    if (data.businessId && data.reservationId) {
      socket.emit('message', { payload: 'Ciao'});
    }
  });
};


module.exports = checkoutSocket;
