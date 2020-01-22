const mongoose = require('mongoose');


const ELEMENT_TYPES = {
  TEASER: 'hero',
  SLIDER: 'slider',
};

const FIELD_TYPES = {
  TEXT_BOX: 'textbox',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  RANGE: 'range',
  IMAGE_URL: 'imageUrl',
  COLOR: 'color',
  GROUP: 'group',
  ARRAY: 'array'
};

const fieldSchema = new mongoose.Schema({},   { timestamps: false });

fieldSchema.add({
  name: { type: String, required: true, },
  label: { type: String, required: true, },
  required: Boolean,
  fieldType: {
    enum: Object.values(FIELD_TYPES),
  },
  subElements: [fieldSchema],
});

const layoutElementSchema = new mongoose.Schema({
  elementType: {
    enum: Object.values(ELEMENT_TYPES),
    type: String,
    required: true,
    unique: true,
  },
  fields: {
    required: true,
    type: [fieldSchema],
  },
  attributes: {
    required: false,
    type: mongoose.Schema.Types.Mixed,
  }
});


exports.LayoutElement = mongoose.model('LayoutElement', layoutElementSchema, 'layoutelements');
exports.ELEMENT_TYPES = ELEMENT_TYPES;
exports.FIELD_TYPES = FIELD_TYPES;
