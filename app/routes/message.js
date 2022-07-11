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


// ...
//CRUD

//Read
router.get("/getMessages", function(req, res){
  oracledb.getConnection(connAttr, function(err, connection){
  let query = 'SELECT ID, SENDER_ID, RECIEVER_ID ,TEXT, STATUS, MESSAGE_DATE FROM "MESSAGE" ';
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
router.post("/addMessage", function (req, res) {
  oracledb.getConnection(connAttr, function (err, connection) {
      if (err) {
          console.log(err);
      }
      console.log("Connected to Database");
      let query =
          'insert into "MESSAGE" (SENDER_ID , RECIEVER_ID , TEXT , STATUS , MESSAGE_DATE ) values( :SENDER_ID , :RECIEVER_ID , :TEXT , :STATUS , :MESSAGE_DATE )';
      let binds = [
          req.body.SENDER_ID,
          req.body.RECIEVER_ID,
          req.body.TEXT,
          req.body.STATUS,
          req.body.MESSAGE_DATE,
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

router.get("/deleteMessage/:id", function (req, res) {
  oracledb.getConnection(connAttr, function(err, connection){
    let id = req.params.id;
    console.log("id=" +id);
    if(err){
      console.log(err);
    }
    console.log("Connected to Database");
    let query = 'Delete  from "MESSAGE"  where ID = ' + id ;
    connection.execute(query, {}, {autoCommit: true }, function(err, result){
      console.log("Executing query...");
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
router.post("/updateMessage/:id", function (req, res) {
  oracledb.getConnection(connAttr, function (err, connection) {
      if (err) {
          console.log(err);
      }
      console.log("Connected to Database");
      let id = req.params.id;
      let query =
          'Update "MESSAGE" set SENDER_ID = :SENDER_ID , RECIEVER_ID = :RECIEVER_ID , TEXT = :TEXT, STATUS = :STATUS, MESSAGE_DATE = :MESSAGE_DATE  where id = '+ id;

      let binds = [
        req.body.SENDER_ID,
        req.body.RECIEVER_ID,
        req.body.TEXT,
        req.body.STATUS,
        req.body.MESSAGE_DATE,
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