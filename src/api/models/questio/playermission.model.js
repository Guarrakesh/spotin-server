const mongoose = require('mongoose');
const {MissionStatus, TaskStatus} = require('questio/core');

const Schema = mongoose.Schema;

const PlayerTaskSchema = new Schema({
  playerId: { required: true, type: Schema.Types.ObjectId },
  taskId:  { required: true, type: Schema.Types.ObjectId },
  missionId:  { required: true, type: Schema.Types.ObjectId },
  questId : { required: true, type: Schema.Types.ObjectId },
  trigger: { required: true, type: String  },
  progress: Number,
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    required: true,
    default: TaskStatus.pending
  },
  completedAt: Date,
  canceledAt: Date,
  assignedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  }
} );

const PlayerMissionSchema = new Schema({
  status: {
    type: String,
    enum: Object.values(MissionStatus),
    required: true,
  },
  missionId: { required: true, type: Schema.Types.ObjectId },
  questId:  { required: true, type: Schema.Types.ObjectId },
  playerId:  { required: true, type: Schema.Types.ObjectId },
  tasks: [PlayerTaskSchema],
  completedAt: Date,
  canceledAt: Date,
  assignedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  }

}, {timestamps: false, collection: 'qs_player_missions' });



exports.PlayerMissionSchema = PlayerMissionSchema;
exports.PlayerMission =  mongoose.model('PlayerMission', PlayerMissionSchema);
