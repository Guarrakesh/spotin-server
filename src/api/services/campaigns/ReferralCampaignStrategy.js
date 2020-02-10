const { RecipientType } = require('../../models/campaign/campaign.model');

class ReferralCampaignStrategy {


  /**
   * Given a rule and the userId related to the event, choose which is the recipient and get it
   * @param rewardRule
   * @param userId
   * @return {Promise<void>}
   */
  getRecipientId(rewardRule, data) {
    if (rewardRule.recipientType === RecipientType.REFERRER) {
      return data.referredBy;
    } else if (rewardRule.recipientType === RecipientType.USER) {
      return data.userId;
    }
  }


}

exports.ReferralCampaignStrategy = ReferralCampaignStrategy;
