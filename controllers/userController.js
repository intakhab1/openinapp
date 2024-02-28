const User = require('../models/userModel');

const createUser = async (req, res) => {
  try {
    const { phone_number, priority } = req.body;

    const user = new User({ phone_number, priority });
    await user.save();

    res.json({ message: 'User created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
};

