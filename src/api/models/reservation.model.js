const mongoose = require('mongoose');
const httpStatus = require('http-status');

const reservationSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  broadcast: {
    type: mongoose.Schema.ObjectId,
    ref: "Broadcast"
  },

  created_at: Date,



});


exports.reservationSchema = reservationSchema;




