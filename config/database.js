const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

module.exports = dbConnect;

// module.exports = {
//   SECRET_KEY: 'your_secret_key',
//   TWILIO_ACCOUNT_SID: 'your_twilio_account_sid',
//   TWILIO_AUTH_TOKEN: 'your_twilio_auth_token',
//   TWILIO_PHONE_NUMBER: 'your_twilio_phone_number',
// };

