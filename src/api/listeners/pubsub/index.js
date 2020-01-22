const { PubSub } = require('pubsub-js');

const { onSignUp } = require('./user');


exports.initPublishSubscribeListeners = function() {
  PubSub.subscribe('USER_REGISTERED', onSignUp);
}


