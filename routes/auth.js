const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser=require('../Middleware/fetchuser')
const JWT_SECRET = 'mynameisashish'
// Create a user using:Post "/api/auth/" . Doesn't require auth
let success;
router.post(
  "/createUser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Invalid password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check whether user with same email exist
    try{
    let user = await User.findOne({email:req.body.email});
    if(user){
      return res.status(400).json({error:"sorry user with this email exist"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass= await bcrypt.hash(req.body.password,salt)
  user = await User
      .create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data={
        user:{
          id:user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
   success = true;
      res.json({success,authToken})
   } catch(err){
      console.error(err.message);
      res.status(500).send("Internal server error")
   }
  }

);

// authenticate a user login : no login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Cannot be blank").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
      let user= await User.findOne({email});
      if(!user){
        success=false
        return res.status(400).json({success,error:"Please try to login with correct credentials"});

      }
      const  passwordCompare = await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        success=false
        return res.status(400).json({success,error:"Please try to login with correct credentials"});
      }
      const data={
        user:{
          id:user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({success,authToken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
// Rout3 : Get loggedin user details: login required 
router.post(
  "/getuser",fetchuser,
  async (req, res) => {
try {
  let userId =req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user);
  
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}
})

module.exports = router;
