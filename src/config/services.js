const UserTransaction = require('../api/services/SpotCoinTransactionService');
const {UserService} = require('../api/services/UserService');
const {ReservationService} = require('../api/services/ReservationService');
exports.init = function(container) {
  container.register('userTransaction', UserTransaction);
  container.register('reservationService', ReservationService);
  container.register('userService', UserService, ['reservationService'] );
};

