const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.auth = (req,res,next)=>{
    try {

        console.log("cookies", req.cookies.token);
        console.log("body", req.body.token);
        // console.log("header", req.header("Authorization"));

        const token = req.body.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token missing"
            })
        }

        try{
            const payload = jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);

            req.user = payload;
        } catch(err) {
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            });
        }

        next();

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error occured in auth middleware"
        });
    }
}


exports.isStudent = (req,res,next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for students"
            });
        }

        next();
    } catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error occured in isStudent middleware"
        });
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for admin"
            });
        }

        next();
    } catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error occured in isAdmin middleware"
        });
    }
}