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
router.get("/getEventParticipants", function(req, res){
  oracledb.getConnection(connAttr, function(err, connection){
  let query = 'SELECT ID, EVENT_ID, USER_ID  FROM "EVENT PARTICIPANT" ';
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
router.post("/addEventParticipant", function (req, res) {
  oracledb.getConnection(connAttr, function (err, connection) {
      if (err) {
          console.log(err);
      }
      console.log("Connected to Database");
      let query =
          'insert into "EVENT PARTICIPANT" (EVENT_ID , USER_ID ) values( :EVENT_ID , :USER_ID )';
      let binds = [
          req.body.EVENT_ID,
          req.body.USER_ID,
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

router.get("/deleteEventParticipant/:id", function (req, res) {
  oracledb.getConnection(connAttr, function(err, connection){
    let id = req.params.id;
    console.log("id=" +id);
    if(err){
      console.log(err);
    }
    console.log("Connected to Database");
    let query = 'Delete  from "EVENT PARTICIPANT"  where ID = ' + id ;
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
router.post("/updateEventParticipant/:id", function (req, res) {
  oracledb.getConnection(connAttr, function (err, connection) {
      if (err) {
          console.log(err);
      }
      console.log("Connected to Database");
      let id = req.params.id;
      let query =
          'Update "EVENT PARTICIPANT" set EVENT_ID = :EVENT_ID , USER_ID = :USER_ID  where id = '+ id;

      let binds = [
        req.body.EVENT_ID,
        req.body.USER_ID,
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