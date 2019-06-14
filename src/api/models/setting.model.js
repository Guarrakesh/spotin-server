const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  type: String,
  value: mongoose.Schema.Types.Mixed,
  enabled: {
    type: Boolean,
    default: true,
  }
}, { strict: false, timestamps: true  });

settingSchema.index({ key: 1 });

settingSchema.plugin(mongoosePaginate);
exports.settingSchema = settingSchema;
exports.Setting = mongoose.model('Setting', settingSchema, 'settings');