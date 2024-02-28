const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.userMiddleware = (req,res, next) => {
    try{
        //extract JWT token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        
        if(!token || token === undefined) {
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        //verify the token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            //why this ?
            req.user = payload;
        } catch(error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid , Cannot Authenticate the user',
            });
        }
        next();
    } 
	catch(error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying/Authenticating the token',
            error:error.message,
        });
    }
   
}

