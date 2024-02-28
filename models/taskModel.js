const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  due_date: Date,
  priority: Number,
  status: String,
  deleted_at: Date,
});

module.exports = mongoose.model('Task', taskSchema);