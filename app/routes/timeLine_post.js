const express = require('express')
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let router = express.Router();

const dbconnection = require("../config/db_config");
let connAttr = dbconnection.connAttr;

// ...
//CRUD

//Read
router.post("/getTimeLinePost", function(req, res){
  oracledb.getConnection(connAttr, function(err, connection){
  let query = 'SELECT ID, POST_ID, USER_ID FROM "Timeline Post" ';
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
router.post("/createTimeLinePost", function (req, res) {
  oracledb.getConnection(connAttr, function (err, connection) {
      if (err) {
          console.log(err);
      }
      console.log("Connected to Database");
      let query =
          'insert into "Timeline Post" (POST_ID , USER_ID) values( :POST_ID , :USER_ID )';
      let binds = [
          req.body.POST_ID,
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

router.get("/DeleteUser/:id", function (req, res) {
  oracledb.getConnection(connAttr, function(err, connection){
    let id = req.params.id;
    console.log("id=" +id);
    if(err){
      console.log(err);
    }
    console.log("Connected to Database")
    let query = 'Delete  from "Timeline Post"  where ID = ' + id ;
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
          'Update "Timeline Post" set POST_ID = :POST_ID , USER_ID = :USER_ID where id = '+ id;

      let binds = [
            req.body.POST_ID,
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