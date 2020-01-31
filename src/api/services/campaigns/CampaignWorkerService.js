const omit = require('lodash/omit');
const { Campaign, ConditionOperator, RecipientType, RuleFrequency } = require('../../models/campaign/campaign.model');
const { CampaignRewardAssignment } = require('../../models/campaign/campaignrewardassignment.model');
const Logger = require('heroku-logger');
const SpotCoinTransactionService = require('../SpotCoinTransactionService');


class CampaignWorkerService {

  /**
   *
   * @param {UserService} userService
   * @param {NotificationService} notificationService
   * @param {EventService} eventService
   */
  constructor(userService, notificationService, eventService) {
    this.userService = userService;
    this.notificationService = notificationService;
    this.eventService = eventService;

    this.campaignSubscriptions = {};

    this.subscribeAllActiveCampaigns();
  }


  /**
   * Subscribe all active campaigns to the pub/sub
   * @return {Promise<void>}
   */
  async subscribeAllActiveCampaigns() {
    const activeCampaigns = await Campaign.find({ active: true });
    if (!activeCampaigns || activeCampaigns.length <= 0) {
      return;
    }

    for (const campaign of activeCampaigns) {
      this.subscribeCampaign(campaign);
    }
  }


  /**
   * Unsubscribe a campaign and remove its tokens
   * @param campaignId
   */
  unsubscribeCampaign(campaignId) {
    for (const token of this.campaignSubscriptions[campaignId]) {
      this.eventService.unsubscribeTo(token);
      this.campaignSubscriptions = omit(this.campaignSubscriptions, campaignId);
    }
  }

  /**
   * Subscribe a campaign to pub/sub if it is not currently active
   * @param {Document<Campaign>} campaign
   * @param force if true and the campaign is already subscribed, unsubscribe it and resubscribe
   */
  async subscribeCampaign(campaign, force = false) {
    if (this.campaignSubscriptions[campaign.id] && force) {
      this.unsubscribeCampaign(campaign.id);
    }

    if (!this.campaignSubscriptions[campaign.id]) {
      const tokens = campaign.rewardRules.map(rule => this.eventService.subscribeTo(rule.eventName, this.handleEvent))
      this.campaignSubscriptions = {...this.campaignSubscriptions, [campaign.id]: tokens };
    }

  }


  /**
   * Given a rule and the userId related to the event, choose which is the recipient and get it
   * @param rewardRule
   * @param userId
   * @return {Promise<void>}
   */
  async getRecipientId(rewardRule, userId) {
    if (rewardRule.recipientType === RecipientType.REFERRER) {
      const user = await this.userService.findById(userId);
      return user.reffererId;
    } else if (rewardRule.recipientType === RecipientType.USER) {
      return userId;
    }
  }
  async handleEvent(event, data) {

    Logger.log('info', `[CampaignService] Received ${event} event`);


    const subscribedCampaignIds = Object.keys(this.campaignSubscriptions);
    const matchedCampaign = await Campaign.find({ active: true, _id: { $in: subscribedCampaignIds }});

    for(const campaign of matchedCampaign) {
      const matchedRewardRules = await this.getMatchedRewardRules(campaign, event, data);

      for (const matchedRule of matchedRewardRules) {
        // get, if existing,the rewardassignment
        const campaignRewardAssignment = await CampaignRewardAssignment.findOne({
          recipientId: await this.getRecipientId(matchedRule, data.userId),
          campaignId: campaign.id,
          rewardRuleId: matchedRule.id,
          completed: false,
        });
        if (campaignRewardAssignment) {
          // Rule must be matched n times, so progress it
          if (matchedRule.frequency === RuleFrequency.N_TIMES) {
            campaignRewardAssignment.progress = (campaignRewardAssignment.progress || 0) + 1;
            if (campaignRewardAssignment.progress >= matchedRule.numOfTimes) {
              // rule completed
              this.completeAndAssignRewardRule(campaign, campaignRewardAssignment, matchedRule);
            }
            await campaignRewardAssignment.save();

          }
          // if the frequency is "ONCE" but assignment already exists, it is inconsistent.
          // TODO: send notification
        } else {
          this.assignReward(matchedRule, campaign, await this.getRecipientId(matchedRule, data.userId));
        }
      }

    }


    console.log(event, data);
  }

  /**
   * Returns the campaign matched rules by the given event
   * @param {Document<Campaign>} campaign
   * @param event
   * @param data
   * @return {Promise<Array<rewardRuleSchema>>}
   */
  async getMatchedRewardRules(campaign, event, data) {
    const matchedRules = [];
    for (const rule of campaign.rewardRules) {
      if (!rule.eventName !== event) continue;

      if (rule.eventConditions && rule.eventConditions.length > 0) {
        const matchedConditions = rule.eventConditions.filter((cond) => this.checkTaskConditionMet(cond, data));
        if (matchedConditions.length === rule.eventConditions.length) {
          matchedRules.push(rule);
        }
      }

    }
    return matchedRules;
  }


  /**
   * Assign a reward to a recipient and send notification if specified
   * @param rewardRule
   * @param {Document<Campaign>} campaign
   * @param userId
   * @param {boolean} sendNotification
   * @return {Promise<void>}
   */
  async assignReward(rewardRule, campaign, userId, sendNotification = true) {
    try {


      const assignment = new CampaignRewardAssignment({
        recipientId: userId,
        campaignId: campaign.id,
        rewardType: campaign.rewardType,
        rewardRuleId: rewardRule.id,
        rewardValue: rewardRule.rewardValue,
        completed: true,
        assignedAt: Date.now(),
      });

      await this.sendReward(campaign, rewardRule, userId);
      assignment.save();
    } catch (e) {
      return Logger.log('error', `[CampaignService] Error in reward assignment`, {
        rewardRule: rewardRule.toObject(),
        campaign: campaign.toObject(),
        userId,
      });

    }

    if (!sendNotification) return;

    const user = await this.userService.findById(userId);
    this.notificationService.sendToUser(userId, {
      notification: { title: `Congratulazioni, ${user.name}!`, body: "Hai ricevuto il tuo premio" },
      data: { campaign, rewardRule, assignment }
    }, true);

  }

  /**
   * Complete an assignment and reward the recipient
   * @param assignment
   * @param rewardRule
   * @return {Promise<*>}
   */
  async completeAndAssignRewardRule(campaign, assignment, rewardRule) {

    try {  // TODO: Check if user exceeds reward maximum ("maximumRewardValue")

      assignment.completed = true;
      assignment.assignedAt = Date.now();

      await this.sendReward(campaign, rewardRule, assignment.recipientId);
      await assignment.save();
    } catch (e) {
      return Logger.log('error', `[CampaignService] Error in reward assignment`, {
        assignment: assignment.toObject(),
        rewardRule: rewardRule.toObject(),
        userId: assignment.recipientId,
        campaignId: campaign.id,
      });
    }

    if (!sendNotification) return;

    const user = await this.userService.findById(assignment.recipientId);
    this.notificationService.sendToUser(assignment.recipientId, {
      notification: { title: `Congratulazioni, ${user.name}!`, body: "Hai ricevuto il tuo premio" },
      data: { campaign, rewardRule, assignment }
    }, true);
  }


  /**
   * Send a reward to a recipient
   * @param campaign
   * @param rewardRule
   * @param userId
   * @return {Promise<void>}
   */
  async sendReward(campaign, rewardRule, userId) {
    let recipient;
    const currentUser =  await this.userService.findById(userId);
    if (rewardRule.recipientType === RecipientType.USER) {
      recipient = currentUser;
    } else if (rewardRule.recipientType === RecipientType.REFERRER) {
      recipient = await this.userService.findOne({ _id: currentUser.referrerId });
    }

    if (!recipient) {
      throw new Error('Recipient not found!');
    }

    switch (campaign.rewardType) {
      case 'SPOT_COIN': {
        await SpotCoinTransactionService.sendSpotCoin(recipient.id, rewardRule.rewardValue, {
          description: 'Campaign',
          campaignId: campaign.id,
          rewardRuleId: rewardRule.id
        })
        break;
      }
      default: {}
    }


  }
  /**
   * Checks is a condition is met with the event data
   * @param condition
   * @param data
   */
  checkTaskConditionMet(condition, data) {
    if (!data[condition.parameterName]) return false;
    switch (condition.operator) {
      case ConditionOperator.EQUAL:
        return data[condition.parameterName] === condition.value;
      case ConditionOperator.IN:
        return Array.isArray(condition.value) && condition.value.includes(data[condition.parameterName]);
      case ConditionOperator.NOT_IN:
        return Array.isArray(condition.value) && !(condition.value).includes(data[condition.parameterName]);
      case ConditionOperator.GREATER_THAN:
        return data[condition.parameterName] > condition.value;
      case ConditionOperator.LESS_THAN:
        return data[condition.parameterName] < condition.value;
      case ConditionOperator.RANGE: {
        return Array.isArray(condition.value) && condition.value.length === 0 &&
            data[condition.parameterName] > condition.value[0] && data[condition.parameterName] < condition.value[1];
      }
      case ConditionOperator.CONTAINS: {
        return Array.isArray(condition.value) && data[condition.parameterName].includes(condition.value);
      }
      case ConditionOperator.PRESENT: {
        return !!data[condition.parameterName]
      }
      default:
        return false;
    }
  }



}

exports.CampaignWorkerService = CampaignWorkerService;
