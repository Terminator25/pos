const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'POS$SecretKEY'

//Route 1: Create a user 
router.post(
    "/add",
    [
      body("name", "Enter a valid name").isLength({ min: 3 }),
      body("username", "Enter a valid username").isLength({ min: 3 }),
      body("password", "Enter a valid password").isLength({min: 8})
    ],async (req, res) => {   

        try {
            //if there are errors return bad request
            const errors = validationResult(req);
    
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }
    
            //check whether customer already exists
            let found = await User.findOne({ username: req.body.username });
            if (found) {
            return res
                .status(400)
                .json({
                error: "Username already exists",
                });
            }
            
            const salt =await bcryptjs.genSalt(10);
            const secPass = await bcryptjs.hash(req.body.password, salt);
            const user = await User.create({
                name:req.body.name,
                username:req.body.username,
                password:secPass
            });
            
            const data = {
                user:{
                    username: user.username
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET);

            res.json({authtoken});
        }catch(error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
); 

//Route 2 Authenticate and login
router.post("/login",[body("password", "Password Cannot be Empty").exists()], async (req, res)=>{
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {return res.status(400).json({ errors: errors.array() });}    

    const {username, password} = req.body;

    let success = false;
 
    try {
            let user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({errors: "Incorrect Credentials" });
            }  

            const passwordcompare = await bcryptjs.compare(password, user.password)

            if(!passwordcompare){
                return res.status(400).json({errors:"Incorrect Credentials"});
            }

            const data = {
                user:{
                    username: user.username
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success=true;

            res.json({success, authtoken});
        } catch (error) {
            success=false
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

//Route 3: Get logged in user details
router.post('/getuser', fetchuser, async(req, res)=> {
    try {
        userId=req.user.username;
        const user= await User.findOne({userId}).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}
)
module.exports = router;
