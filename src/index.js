// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env, mongo } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const express = require('express');
const path = require('path');
// open mongoose connection

mongoose.connect();


if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  // Serve static files
  app.use(express.static(path.join(__dirname, '../admin/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/build', 'index.html'));
  });
}
// listen to requests
app.listen(port, '0.0.0.0', () => console.info(`server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
