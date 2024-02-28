const express = require('express');
const userController = require('../controllers/userController');
const { userMiddleware } = require("../middleware/auth")
const router = express.Router();

router.post('/create', userMiddleware, userController.createUser);
router.get('/getAll', userMiddleware, userController.getAllUsers);

module.exports = router;



