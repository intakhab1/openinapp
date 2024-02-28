const express = require('express');
const taskController = require('../controllers/taskController');
const { userMiddleware } = require("../middleware/auth")
const router = express.Router();

router.post('/create', userMiddleware, taskController.createTask);
router.get('/user-tasks', userMiddleware, taskController.allUsersTasks);
router.post('/update-task/:task_id', userMiddleware, taskController.updateTask);
router.post('/delete-task/:task_id', userMiddleware, taskController.deleteTask);

module.exports = router;


