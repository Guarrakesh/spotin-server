const eventEmitter = require('../emitters');
const sendAdminEmailOnReservation = require('./send_admin_email_on_reservation');
const sendAdminEmailOnBroadcastRequest = require('./send_admin_email_on_broadcast_request');
eventEmitter.on('user-reservation', sendAdminEmailOnReservation);
eventEmitter.on('user-broadcast-request', sendAdminEmailOnBroadcastRequest);

