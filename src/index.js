
// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env, mongo } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const express = require('express');
const path = require('path');
const socket = require('socket.io');
const socketHandlers = require('./api/listeners/socketio');

require('./api/listeners/subscriptions');
require('./api/listeners/pubsub/index').initPublishSubscribeListeners();
// open mongoose connection

mongoose.connect();


if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === "heroku_development") {
  // Serve static files
  app.use(express.static(path.join(__dirname, '../admin/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/build', 'index.html'));
  });
}
// listen to requests
const server = app.listen(port, '0.0.0.0', () => console.info(`server started on port ${port} (${env})`));

// Socket init
const io = socket(server);
socketHandlers(io);

// Inject Socket in Res
app.use(function (req, res, next) {
  res.io = io;
});




/**
* Exports express
* @public
*/
module.exports = app;
