const mongoose = require('mongoose');
const {IQuest, TaskCondition, TaskConditionOperator} = require('questio/core');


const Schema = mongoose.Schema;



const TaskSchema = new Schema({
  lead: {type: String, required: true},
  quantity: Number,
  deadline: Date,
  trigger: {required: true, type: String},
  conditions: new Schema({
    parameterName: {required: true, type: String},
    operator: {
      type: String,
      enum: Object.values(TaskConditionOperator),
      required: true,
    },
    value: Schema.Types.Mixed,
  }, {_id: false, timestamps: false}),
});



const MissionSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  tasks: Schema.Types.Mixed,
  cancelable: Boolean,
}, {timestamps: false});


const QuestSchema = new Schema({
  name: {type: String, required: true},
  slug: {
    type: String,
    required: true,
  },
  description: {type: String, required: true},
  startDate: Date,
  endDate: Date,
  missions: [MissionSchema],
  deployed: Boolean,
  cancelable: Boolean,

}, {timestamps: false, collection: 'qs_quests' });



exports.QuestSchema = QuestSchema;
exports.Quest = mongoose.model('Quest', QuestSchema);
