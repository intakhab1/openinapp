const Task = require('../models/taskModel');
const SubTask = require('../models/subTaskModel');

const cron = require('node-cron');
const twilio = require('twilio');
const dotenv = require("dotenv");
dotenv.config();

const calculatePriority = (due_date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
  
    if (due_date <= today) {
      return 0;
    } else if (due_date > tomorrow && due_date <= dayAfterTomorrow) {
      return 1;
    } else if (due_date > dayAfterTomorrow && due_date <= dayAfterTomorrow + 2) {
      return 2;
    } else {
      return 3;
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, due_date } = req.body;
        const priority = calculatePriority(due_date);
        const status = 'TODO';

        const task = new Task({ title, description, due_date, priority, status });
        await task.save();

        res.json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Get all user tasks with filters and pagination
const allUsersTasks = async (req, res) => {
    try {
      const { priority, due_date, page, limit } = req.query;
  
      const tasks = await Task.find({
        priority: priority || { $exists: true },
        due_date: due_date || { $exists: true },
        deleted_at: null,
      })
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.json({ tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// update task
const updateTask = async (req, res) => {
    try {
      const { task_id } = req.params;
      const { due_date, status } = req.body;
  
      const priority = calculatePriority(due_date);
  
      await Task.findByIdAndUpdate(
        task_id,
        { due_date, status, priority },
        { new: true }
      );
  
      res.json({ message: 'Task updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
      const { task_id } = req.params;
  
      await Task.findByIdAndUpdate(task_id, { deleted_at: new Date() });
  
      // Soft delete corresponding subtasks
      await SubTask.updateMany({ task_id }, { deleted_at: new Date() });
  
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Cron logic for changing priority of task based on due_date
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    await Task.updateMany(
      {
        due_date: { $lte: today },
        priority: { $ne: 0 },
        deleted_at: null,
      },
      { priority: 0 }
    );

    await Task.updateMany(
      {
        due_date: { $gt: tomorrow, $lte: dayAfterTomorrow },
        priority: { $nin: [0, 1] },
        deleted_at: null,
      },
      { priority: 1 }
    );

    await Task.updateMany(
      {
        due_date: { $gt: dayAfterTomorrow },
        priority: { $nin: [0, 1, 2] },
        deleted_at: null,
      },
      { priority: 2 }
    );

    console.log('Task priorities updated based on due_date');
  } catch (error) {
    console.error('Error in changing task priority:', error);
  }
});

// Cron logic for voice calling using Twilio for overdue tasks

cron.schedule('0 12 * * *', async () => {
  try {
    const overdueTasks = await Task.find({
      due_date: { $lt: new Date() },
      priority: { $in: [0, 1, 2] },
      deleted_at: null,
    }).populate('user', 'phone_number priority');

    const twilioClient = new twilio( process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    for (const task of overdueTasks) {
      const user = task.user;
      const phone_number = user.phone_number;

      if (user.priority === task.priority) {
        await twilioClient.calls.create({
          to: phone_number,
          from: process.env.TWILIO_PHONE_NUMBER,
          url: 'https://intakhab1.github.io/twilio/voice.xml', 
        });

        console.log(`Calling user ${phone_number} for task ${task.title}`);
        break; 
      }
    }
  } catch (error) {
    console.error('Error in Twilio voice calling:', error);
  }
});

module.exports = {
  createTask,
  allUsersTasks,
  updateTask,
  deleteTask,
};
