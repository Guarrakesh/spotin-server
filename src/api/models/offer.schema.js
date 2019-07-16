const mongoose = require('mongoose');


//0: prezzo fisso, 1: sconto in percentuale, 2: sconto assoluto
const types = [0,1,2];

const offerSchema = new mongoose.Schema({

  title: {
    type: String,
  },
  type: {
    type: Number,
    enum: types,
    required: true,
  },
  value: Number,
  isDefault: {
    type: Boolean,
    default: false,
  },
  description: String,


}, { createdAt: 'created_at', updatedAt: 'updated_at' });

module.exports = offerSchema;
