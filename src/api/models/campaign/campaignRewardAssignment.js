const mongoose = require('mongoose');


const campaignRewardAssignmentSchema = new mongoose.Schema({
  recipientId: {
    required: true,
    type: String
  },
  campaignId: {
    required: true,
    ref: 'Campaign',
    type: mongoose.Schema.Types.ObjectId,
  },
  rewardType: {
    required: true,
    type: String,
  },
  rewardRuleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  rewardValue: {
    required: true,
    type: mongoose.Schema.Types.Mixed,

  },
  assignedAt: {
    default: () => Date.now(),
    type: Date,
  },
  collectedAt: Date,



}, { timestamps: false });


exports.Campaign = mongoose.model('CampaignRewardAssignment', campaignRewardAssignmentSchema);

