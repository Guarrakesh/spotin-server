const mongoose = require('mongoose');
const { ELEMENT_TYPES } = require('./layoutelement.model');
const appLayoutBlockSchema = new mongoose.Schema({
  elementType: {
    type: String,
    enum: Object.values(ELEMENT_TYPES),

  },
  elementTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fields: mongoose.Schema.Types.Mixed,
  order: {
    type: Number,
    required: true,
  },
  name: {
    required: true,
    type: String,
  },
  screen:{
    type: String,
    required: true,
  },
  beforeElementIdentifier: String,
  afterElementIdentifier: String,
});

exports.AppLayoutBlock = mongoose.model('AppLayoutBlock', appLayoutBlockSchema);
