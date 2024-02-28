const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone_number: {
    type:String,
  },
  priority:{
    type:Number
  },
});

module.exports = mongoose.model('User', userSchema);