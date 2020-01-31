const mongoose = require('mongoose');

const ConditionOperator = {
  CONTAINS: 'CONTAINS',
  EQUAL: 'EQUAL',
  IN: 'IN',
  NOT_IN: 'NOT_IN',
  GREATHER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN',
  RANGE: 'RANGE',
  PRESENT: 'PRESENT',
};
const RuleFrequency = {
  ONCE: 'ONCE',
  N_TIMES: 'N_TIMES'
};
const RecipientType = {
  USER: 'USER',
  FRIEND: 'FRIEND',
  REFERRER: 'REFERRER',
}
const RuleEventParameterCondition = new mongoose.Schema({
  parameterName: {
    required: true,
    type: String,
  },
  value: {
    required: false,
    type: mongoose.Schema.Types.Mixed
  },
  operator: {
    default: 'PRESENT',
    type: String,
    enum: Object.values(ConditionOperator),
  }
});
const rewardRuleSchema = new mongoose.Schema({
  recipientType: {
    type: String,
    required: true,
    enum: Object.values(RecipientType),
  },
  eventName: {
    type: String,
    required: true,
  },
  rewardValue: mongoose.Schema.Types.Mixed,

  frequency: {
    type: String,
    required: true,
    enum: Object.values(RuleFrequency),
  },
  numOfTimes: Number,

  rewardAssignmentMessage: String,

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
exports.ConditionOperator = ConditionOperator;
exports.RuleFrequency = RuleFrequency;
exports.RecipientType = RecipientType;
