const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  // status (0,1) //0- incomplete, 1- complete
  status: Number,
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
  status: Number,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: Date,
});

module.exports = mongoose.model('SubTask', subTaskSchema);