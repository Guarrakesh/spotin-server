const UserTransaction = require('../api/services/SpotCoinTransactionService');
const {UserService} = require('../api/services/UserService');
const {ReservationService} = require('../api/services/ReservationService');
const {BroadcastService} = require('../api/services/BroadcastService');
const { BusinessService } = require('../api/services/BusinessService');
const { EventService } = require('../api/services/events/EventService');
// const { QuestioService } = require('../api/services/QuestioService');
const { FirebaseAdminService } = require('../api/services/FirebaseAdminService');
const { LayoutElementService } = require('../api/services/LayoutElementService');
const { NotificationService } = require('../api/services/notification/NotificationService');

const firebaseServiceAccount = require('../assets/service-account');

exports.init = function(container) {
  container.register('businessService', BusinessService);
  container.register('broadcastService', BroadcastService);
  container.register('userService', UserService, ['broadcastService', 'businessService'] );
  container.register('userTransaction', UserTransaction, ['userService', 'businessService']);
  container.register('reservationService', ReservationService, ['userTransaction']);
  //container.register('questioService', QuestioService);
  container.register('layoutElementService', LayoutElementService );
  container.register('eventService', EventService);
  container.register('firebaseAdminService', new FirebaseAdminService(firebaseServiceAccount) );
  container.register('notificationService', NotificationService, ['userService', 'firebaseAdminService']);



};

