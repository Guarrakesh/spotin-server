const omit = require('lodash/omit');
const { Campaign } = require('../../models/campaign/campaign.model');
const { CampaignRewardAssignment } = require('../../models/campaign/campaignrewardassignment.model');
const Logger = require('heroku-logger');

class CampaignService {

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
    const activeCampaigns = await Campaign.find({ published: true });
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




  async handleEvent(event, data) {

    Logger.log('info', `[CampaignService] Received ${event} event`);


    console.log(event, data);
  }






}

exports.CampaignService = CampaignService;
