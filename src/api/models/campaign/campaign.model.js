const mongoose = require('mongoose');
const RuleEventParameterCondition = new mongoose.Schema({
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
    enum: ['user', 'friend'],
  },
  eventName: {
    type: String,
    required: true,
  },
  rewardValue: mongoose.Schema.Types.Mixed,

  eventConditions: [RuleEventParameterCondition],
});

const campaignSchema = new mongoose.Schema({
  campaignType: {
    required: true,
    type: String,
    enum: ['referral'],
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

  rewardRules: {
    type: [rewardRuleSchema],
    required: true,
  },

  active: Boolean,

}, { timestamps: false });


exports.Campaign = mongoose.model('Campaign', campaignSchema);

