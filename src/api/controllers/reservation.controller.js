const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { handler: errorHandler } = require('../middlewares/error');
const bodyParser = require('body-parser');

const { Broadcast } = require('../models/broadcast.model');
const User = require('../models/user.model');


