const Container = require('../../../di/Container');

//const { PlayerMission } = require('../../models/questio/playermission.model');
//const { PlayerQuest } = require('../../models/questio/playerquest.model');
//const { Quest } = require('../../models/questio/quest.model');

exports.onSignUp = async (msg, data) => {
  // const questioService = Container.getInstance().get('questioService');
  // questioService.sendEvent('USER_REGISTERED', data.user.id );
  //
  // const quest = await Quest.findOne({ slug: 'main-quest' });
  // if (quest) {
  //   questioService.startQuest(data.user.id, quest.id);
  // }
};
