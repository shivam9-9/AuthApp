const User = require("../model/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.signup = async (req,res)=>{
    try{
        const {name,email,password,role} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"user already exists",
            })
        }

        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            res.status(500).json({
                success:false,
                message:"error in hashing password"
            })
        }

        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        res.status(200).json({
            success:true,
            message:"signup successfull"
        })
    }
    catch(error){

        console.error(error);
       return res.status(500)({
         success:false,
         message:"signup failed, try again"
       })
    }
}


exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(404).json({
                success:false,
                message:"enter email and password"
            })
        }

        let user = await User.findOne({email : email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User no found , Signup first"
            });
        }
        
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role
        }

        if(await bcrypt.compare(password,user.password)){
            let token = jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h",
                                });
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            console.log(user);
            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully"
            })

        }
        else{
            return res.status(403).json({
                success:false,
                message:"Incorrect Password"
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login failure"
        });
    }
}