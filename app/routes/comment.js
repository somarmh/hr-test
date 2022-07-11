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
router.get("/getComments", function(req, res){
  oracledb.getConnection(connAttr, function(err, connection){
  let query = 'SELECT ID, POST_ID, WRITER_ID, TEXT FROM "COMMENT" ';
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
router.post("/addComment", function (req, res) {
  oracledb.getConnection(connAttr, function (err, connection) {
      if (err) {
          console.log(err);
      }
      console.log("Connected to Database");
      let query =
          'insert into "COMMENT" (POST_ID , WRITER_ID , TEXT) values( :POST_ID , :WRITER_ID , :TEXT )';
      let binds = [
          req.body.POST_ID,
          req.body.WRITER_ID,
          req.body.TEXT,
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

router.get("/deleteComment/:id", function (req, res) {
  oracledb.getConnection(connAttr, function(err, connection){
    let id = req.params.id;
    console.log("id=" +id);
    if(err){
      console.log(err);
    }
    console.log("Connected to Database");
    let query = 'Delete  from "COMMENT"  where ID = ' + id ;
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
router.post("/updateComment/:id", function (req, res) {
  oracledb.getConnection(connAttr, function (err, connection) {
      if (err) {
          console.log(err);
      }
      console.log("Connected to Database");
      let id = req.params.id;
      let query =
          'Update "COMMENT" set POST_ID = :POST_ID , WRITER_ID = :WRITER_ID , TEXT = :TEXT  where id = '+ id;

      let binds = [
          req.body.POST_ID,
          req.body.WRITER_ID,
          req.body.TEXT,
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