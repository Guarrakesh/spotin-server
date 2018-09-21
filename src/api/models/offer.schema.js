const mongoose = require('mongoose');


//0: prezzo fisso, 1: sconto in percentuale, 2: sconto assoluto
const types = [0,1,2];

const offerSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    enum: types,
    required: true
  },
  value: Number,

  description: String,


});

module.exports = offerSchema;
