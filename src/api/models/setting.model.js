const mongoose = require('mongoose');
const async = require('async');

const mongoosePaginate = require('mongoose-paginate');
const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  section: String,
  type: String,
  value: mongoose.Schema.Types.Mixed,
  enabled: {
    type: Boolean,
    default: true,
  }
}, { strict: false, timestamps: true  });


settingSchema.statics.getAppealOptions = async () => {

  const results = await  Promise.all([
    await this.Setting.findOne({ section: 'appealEvaluator', key: 'sportWeight'}, { value: 1,}).exec(),
    await this.Setting.findOne({ section: 'appealEvaluator', key: 'competitionWeight'}, { value: 1}).exec(),
    await this.Setting.findOne({ section: 'appealEvaluator', key: 'competitorWeight'}, { value: 1}).exec(),
    await this.Setting.findOne({ section: 'appealEvaluator', key: 'favoriteSportWeight'}, { value: 1}).exec(),
    await this.Setting.findOne({ section: 'appealEvaluator', key: 'favoriteCompetitorWeight'}, { value: 1 }).exec(),
    await this.Setting.findOne({ section: 'appealEvaluator', key: 'favoriteCompetitionWeight'}, { value: 1 }).exec()
  ]);

  return {
    sportWeight: results[0].value,
    competitorWeight: results[1].value,
    competitionWeight: results[2].value,
    favoriteSportWeight: results[3].value,
    favoriteCompetitorWeight: results[4].value,
  }

};
settingSchema.index({ key: 1 });

settingSchema.plugin(mongoosePaginate);
exports.settingSchema = settingSchema;
exports.Setting = mongoose.model('Setting', settingSchema, 'settings');