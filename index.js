const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 4000;

const dbConnect = require("./config/database"); 
dbConnect(); 

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

const admin = require("./routes/admin");
const taskRoutes = require('./routes/taskRoutes');
const subTaskRoutes = require('./routes/subTaskRoutes');
const userRoutes = require('./routes/userRoutes');

// signUp and Login for Admin
app.use("/api/v1", admin);

// Admin can create multiple user with phone number and priority
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/subtasks', subTaskRoutes);

// Default Route
app.get("/" , (req , res) => {
  res.send(`<h1> This is Server Homepage </h1>`)
})

app.listen(PORT , () => {
	console.log(`server started at ${PORT}`)
})
  
