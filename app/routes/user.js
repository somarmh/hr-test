const express = require('express')
//const jwt = require('jsonwebtoken')
//const User1 = require('../models/usermodel.js');
//const auth = require("../middleware/auth");
//const config = require('../config/auth_config');
const bcrypt = require("bcryptjs");




const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
//const axios = require('axios');

let router = express.Router();

const dbconnection = require("../config/db_config");
let connAttr = dbconnection.connAttr;

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

//Read
router.post("/getUsers", function(req, res){
  oracledb.getConnection(connAttr, function(err, connection){
  let query = 'SELECT ID, EMAIL, HASH_PASSWORD ,PHONE, ADDRESS ,FIRST_NAME, LAST_NAME FROM "User" ';
  console.log("Database Connected");
  connection.execute(query, {},{}, function(err, result){
      if(err) {
        console.log(err);
      }
      connection.release(function(err){
        console.log("connection is  releasesd")
      });
      console.log(result);
      return res.json({success: "true", user: result});
      });
    
  });
});


//CREATE
router.post("/adduser", function (req, res) {
  oracledb.getConnection(connAttr, function (err, connection) {
      if (err) {
          console.log(err);
      }
      console.log("Connected to Database");
      let query =
          'insert into "User" (EMAIL , HASH_PASSWORD , PHONE , ADDRESS , FIRST_NAME , LAST_NAME) values( :EMAIL , :HASH_PASSWORD , :PHONE , :ADDRESS , :FIRST_NAME , :LAST_NAME )';
      let binds = [
          req.body.EMAIL,
          bcrypt.hashSync(req.body.PASSWORD, 8),
          req.body.PHONE,
          req.body.ADDRESS,
          req.body.FIRST_NAME,
          req.body.LAST_NAME
      ];
      connection.execute(
          query,
          binds,
          { autoCommit: true },
          function (err, result) {
              console.log("Executing query....");
              if (err) {
                  console.log(err);
              }

              connection.release(function (err) {
                  console.log("connection is releasesd");
              });
              return res.json(result.rows);
          }
      );
  });
});

//Delete

router.get("/DeleteUser/:id", function (req, res) {
  oracledb.getConnection(connAttr, function(err, connection){
    let id = req.params.id;
    console.log("id=" +id);
    if(err){
      console.log(err);
    }
    console.log("Connected to Database")
    let query = 'Delete  from "User"  where ID = ' + id ;
    connection.execute(query, {}, {autoCommit: true }, function(err, result){
      console.log("Executing query...")
      if(err){
        console.log(err);
        return res.json({success: "false", msg: err.message});
      }
      connection.release(function(err){
        console.log("connection is releasesd");
      });
      return res.json({success: "true"});
    });

  });

});


//Update
router.post("/updateUser/:id", function (req, res) {
  oracledb.getConnection(connAttr, function (err, connection) {
      if (err) {
          console.log(err);
      }
      console.log("Connected to Database");
      let id = req.params.id;
      let query =
          'Update "User" set EMAIL = :EMAIL , HASH_PASSWORD = :HASH_PASSWORD , PHONE = :PHONE , ADDRESS = :ADDRESS , FIRST_NAME = :FIRST_NAME , LAST_NAME = :LAST_NAME where id = '+ id;

      let binds = [
          req.body.EMAIL,
          bcrypt.hashSync(req.body.PASSWORD, 8),
          req.body.PHONE,
          req.body.ADDRESS,
          req.body.FIRST_NAME,
          req.body.LAST_NAME
      ];

      connection.execute(
          query,
          binds,
          { autoCommit: true },
          function (err, result) {
              console.log("Executing query....");
              if (err) {
                  console.log(err);
              }
              connection.release(function (err) {
                  console.log("connection is releasesd");
              });
              return res.json(result.rows);
          }
      );
  });
});




module.exports = router;