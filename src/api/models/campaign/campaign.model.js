const mongoose = require('mongoose');

const RuleEventParameter = new mongoose.Schema({
  parameterName: {
    required: true,
    type: String,
  },
  parameterValue: {
    required: true,
    type: mongoose.Schema.Types.Mixed
  },
  operator: {
    default: 'EQUAL',
    type: String,
    enum: [
      'CONTAINS', 'EQUAL', 'IN', 'NOT_IN', 'GREATER_THAN', 'LESS_THAN', 'RANGE'
    ]
  }
});
const rewardRuleSchema = new mongoose.Schema({
  recipientType: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  rewardValue: mongoose.Schema.Types.Mixed,
});
const campaignSchema = new mongoose.Schema({
  campaignType: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  rewardType: {
    required: true,
    type: String,
  },
  maximumRewardValue: Number,
  rewardAssignmentDelay: Number,

  rewardRules: [rewardRuleSchema],

}, { timestamps: false });


exports.Campaign = mongoose.model('Campaign', campaignSchema);

