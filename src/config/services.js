const UserTransaction = require('../api/services/SpotCoinTransactionService');
const {UserService} = require('../api/services/UserService');
const {ReservationService} = require('../api/services/ReservationService');
const {BroadcastService} = require('../api/services/BroadcastService');
const { BusinessService } = require('../api/services/BusinessService');
// const { QuestioService } = require('../api/services/QuestioService');
const { LayoutElementService } = require('../api/services/LayoutElementService');
exports.init = function(container) {
  container.register('userTransaction', UserTransaction);
  container.register('businessService', BusinessService);
  container.register('reservationService', ReservationService);
  container.register('broadcastService', BroadcastService);
  //container.register('questioService', QuestioService);
  container.register('userService', UserService, ['reservationService', 'broadcastService', 'businessService'] );
  container.register('layoutElementService', LayoutElementService );
};

