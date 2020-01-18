const mongoose = require('mongoose');
const {QuestStatus} = require('questio/core');

const Schema = mongoose.Schema;

const PlayerQuestSchema = new Schema({
  status: {
    type: String,
    enum: Object.values(QuestStatus),
    default: QuestStatus.IN_PROGRESS,
    required: true,
  },
  playerId: { required: true, type: Schema.Types.ObjectId },
  questId: { required: true, type: Schema.Types.ObjectId },
  currentPlayerMissionId: { required: true, type: Schema.Types.ObjectId, ref: 'PlayerQuest' },
  completedAt: Date,
  canceledAt: Date,
  assignedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  }

}, { timestamps: false, collection: 'qs_player_quests'});



exports.PlayerQuestSchema = PlayerQuestSchema;
exports.PlayerQuest = mongoose.model('PlayerQuest', PlayerQuestSchema);
