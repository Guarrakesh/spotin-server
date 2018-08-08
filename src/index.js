// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');

// open mongoose connection
mongoose.connect();


if (process.env.NODE_ENV === 'production') {
  //Serve static files
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname,'../client/build', 'index.html'))
  });
}
// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
