const express = require("express");
const router = express.Router();

const {login ,signup} = require("../controllers/Auth");
const {auth , isStudent , isAdmin} = require("../middlewares/Auth");

router.post("/login", login);
router.post("/signup", signup);


router.get("/student", auth , isStudent , (req,res)=>{
    console.log("logged in as student");
    return res.status(200).json({
        success:true,
        message:"welcome back"
    })
});

router.get("/Admin", auth , isAdmin , (req,res)=>{
    console.log("logged in as admin");
    return res.status(200).json({
        success:true,
        message:"welcome sir"
    })
});

router.get("/test", auth , (req,res)=>{
    console.log("logged in as Test");
    return res.status(200).json({
        success:true,
        message:"testing"
    })
});

router.get("/getEmail", auth , (req,res) => {
    const id = req.user.id;
    console.log("ID: ", id);
    return res.status(200).json({
        success:true,
        message:id
    })
});

module.exports = router;