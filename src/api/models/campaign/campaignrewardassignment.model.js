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

  progress: Number,

  completed: Boolean,

  assignedAt: {
    default: () => Date.now(),
    type: Date,
  },
  collectedAt: Date,



}, { timestamps: false });


exports.CampaignRewardAssignment = mongoose.model('CampaignRewardAssignment', campaignRewardAssignmentSchema);

