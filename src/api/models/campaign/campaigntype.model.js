const mongoose = require('mongoose');

const campaignTypeSchema = new mongoose.Schema({
  slug: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
}, { timestamps: false });


exports.CampaignType = mongoose.model('CampaignType', campaignTypeSchema);

