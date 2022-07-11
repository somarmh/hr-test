const express = require('express')
const jwt = require('jsonwebtoken')
//const User1 = require('../models/usermodel.js');
const auth = require("../middleware/auth");
const config = require('../config/auth_config');
const bcrypt = require("bcryptjs");

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
//const axios = require('axios');

let router = express.Router();

const dbconnection = require("../config/db_config");
let connAttr = dbconnection.connAttr;
/*const findOne= (email,password) => {
  oracledb.getConnection(connAttr, function(err, connection){
    let query = "select id from \"USER\" where EMAIL = '"+email+ "' and PASSWORD = '" + password+"'";
    console.log("Database Connected");
    console.log(query);
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
}*/
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let connection;
  try{
      connection = await oracledb.getConnection(connAttr);
      let query = "select id from \"USER\" where EMAIL = '"+email+ "' and PASSWORD = '" + password+"'";
      const result = await connection.execute(query);
      console.log(result.rows.length);
      if(result.rows.length != 0){
        const userDetails = {email : email , password :password};//from database
        try{
            const token = await jwt.sign(userDetails, config.secretKey, {expiresIn:10000})
            const refreshToken = await jwt.sign(userDetails, config.secretKeyRefresh, {expiresIn:864000})
            return res.json({success:true, accessToken: token, refreshToken: refreshToken});
        } catch(err){
            console.log(err);
            return  res.json({success:false, msg: err.message})
        }
      }
      else{
          return res.json({succsess:false, msg: "not valid creditals"});
      } 
  }catch(err){
      console.log(err);
      return res.json({success : false, msg: err.message}); 
  }finally{
      await connection.release();
  }  
});


// ...
//CRUD

//Read
router.get("/getUsers", auth.verifyToken, async(req, res) =>{
  const decodedToken = res.locals.decodedToken;
  const email = decodedToken.email;
  if(email == "Ghaffar"){
    let connection;
    try{
        connection = await oracledb.getConnection(connAttr);
        let query = 'SELECT ID, EMAIL, PASSWORD ,PHONE, ADDRESS ,FIRST_NAME, LAST_NAME FROM "USER" ';
        const result = await connection.execute(query);
        console.log(result);
        return res.json(result.rows);
    }catch(err){
        console.log(err);
        return res.json({success : false, msg: err.message}); 
    }finally{
        await connection.release();
    }
}
else{
    return res.json({success: false, msg: "Unauthorized.."}); 
}
});

//CREATE
router.post("/addUser", function (req, res) {
  oracledb.getConnection(connAttr, function (err, connection) {
      if (err) {
          console.log(err);
      }
      console.log("Connected to Database");
      let query =
          'insert into "USER" (EMAIL , PASSWORD , PHONE , ADDRESS , FIRST_NAME , LAST_NAME) values( :EMAIL , :PASSWORD , :PHONE , :ADDRESS , :FIRST_NAME , :LAST_NAME )';
      let binds = [
          req.body.EMAIL,
          req.body.PASSWORD,
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
    let query = 'Delete  from "USER"  where ID = ' + id ;
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
          'Update "USER" set EMAIL = :EMAIL , HASH_PASSWORD = :HASH_PASSWORD , PHONE = :PHONE , ADDRESS = :ADDRESS , FIRST_NAME = :FIRST_NAME , LAST_NAME = :LAST_NAME where id = '+ id;

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