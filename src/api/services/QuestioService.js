const axios = require('axios');



const vars = require('../../config/vars');

class QuestioService {
  constructor() {
  }

  sendEvent(event, playerId, data) {
    const payload = {
      type: 'QS_EVENT',
      event,
      player: { id: playerId },
      ...data,
    };
    return axios.post(vars.questioEventUri, payload);
  }

  startQuest(playerId, questId) {
    // TODO: CONTINUA
    const payload = {
      type: 'QS_START_QUEST',
      questId, player: { id: playerId }
    };

    return axios.post(vars.questioEventUri, payload);
  }



}

exports.QuestioService = QuestioService;
