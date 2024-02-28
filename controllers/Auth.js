const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//signup route handler
exports.signup = async (req,res) => {
    try{
        //get data
        const {name, email, password } = req.body;
        //check if user already exist
        const existingUser = await Admin.findOne({email});

        // if email exists in DB -> throw success and exit
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'Email already Exists',
            });
        }

        // if email not found in DB , then do Sign Up -> 1. Encrypt password 2.Create entry in DB
        //Encrypt the password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return res.status(500).json({
                success:false,
                message:'Error in hashing Password',
            });
        }

        //create entry of a User in DB
        const user = await Admin.create({ name,email,password:hashedPassword })

        return res.status(200).json({
            success:true,
            message:'User Entry Created Successfully',
        });
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Sign Up failed, please try again later',
        });
    }
}

//login
exports.login = async (req,res) => {
    try {

        //fetch data
        const {email, password} = req.body;
        //validation on email and password -> check if user fill email and password or not 
        if(!email || !password) {
            return res.status(400).json({
                success:false,
                message:'Please Fill all Details',
            });
        }

        // validation successful -> check if email registered/present in DB or not
        let user = await Admin.findOne({email});
        // email not found -> throw error
        if(!user) {
            return res.status(401).json({
                success:false,
                message:'Email is not registered',
            });
        }


        // if email alredy registered -> verify Password & generate a JWT TOKEN
        // payload(data)
        const payload = {
            email:user.email,
            id:user._id,
        };
        // compare passwords -> using bcrypt's compare() function
        if(await bcrypt.compare(password,user.password) ) {

            //password matched successfully so,

            // 1- create TOKEN
            let token =  jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"2h",});
            user = user.toObject(); // converting user to object to store TOKEN
            user.token = token;    // store TOKEN in user object
            user.password = undefined; // hide password 

            const options = {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000), // expiry of cookie = 3 days
                httpOnly:true,  // only accessible for server
            }


            // 2- Create COOKIE ( cookieName, data, options ) 
            res.cookie("intkhabCookie", token, options).status(200).json({  // inserting TOKEN in cookie
                success:true,
                token,
                user,
                message:'User Logged in successfully',
            });
        }


        else {
            // passwsord do not match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect, Please Re-enter password",
            });
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login failed, Please try again later',
        });
    }
}