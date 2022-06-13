const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const auth = require("../middleware/auth");
const config = require('../config/auth_config');
const bcrypt = require("bcryptjs");


let router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //const user = await User.findOne({ email });
  const userDetails = {email : email};//from database
  try{
      const token = await jwt.sign(userDetails, config.secretKey, {expiresIn:10000})
      const refreshToken = await jwt.sign(userDetails, config.secretKeyRefresh, {expiresIn:864000})
      return res.json({success:true, accessToken: token, refreshToken: refreshToken});
  } catch(err){
      console.log(err);
      return  res.json({success:false, msg: err.message})
  }
});


// ...
//CRUD

//C
router.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { first_name, last_name, email, password, phone, address } = req.body;
  
      // Validate user input
      if (!(email && password && first_name && last_name && phone && address)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({email});
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        address,
        phone
      });
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
      return  res.json({success:false, msg: err.message})
    }
    // Our register logic ends here
});
  


module.exports = router;