const express = require('express');
const subTaskController = require('../controllers/subTaskController');
const { userMiddleware } = require("../middleware/auth")
const router = express.Router();

router.post('/create/:task_id', userMiddleware, subTaskController.createSubTask);
router.get('/user-subtasks/:task_id', userMiddleware, subTaskController.allUsersSubTasks);
router.post('/update-subtask/:subtask_id', userMiddleware, subTaskController.updateSubTask);
router.post('/delete-subtask/:subtask_id', userMiddleware, subTaskController.deleteSubTask);

module.exports = router;



