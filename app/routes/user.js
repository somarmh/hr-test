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


//login
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
        const userDetails = {email : email , password :password};
        try{
            const token = await jwt.sign(userDetails, config.secretKey, {expiresIn:1000})
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


//refresh
router.post("/refresh", function(req,res) {
  console.log("so");
  const refreshtoken=req.body.refreshToken;
  jwt.verify(refreshtoken, config.secretKeyRefresh, async (err, decoded) =>{
      if(err){
          return res.json({success: false, msg: err.message}) 
      }
      console.log(decoded) ;
      const userDetails = {email : decoded.email , password : decoded.password};
        try{
            const token = await jwt.sign(userDetails, config.secretKey, {expiresIn:1000})
            return res.json({success:true, accessToken: token});
        } catch(err){
            console.log(err);
            return  res.json({success:false, msg: err.message})
        }
  });
});

// ...
//CRUD


//Read
router.get("/getUsers", auth.verifyToken, async(req, res) =>{
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
});


//CREATE
router.post("/addUser", auth.verifyToken, async(req, res) =>{
  let connection;
    try{
        connection = await oracledb.getConnection(connAttr);
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
        const result = await connection.execute(query,binds,{ autoCommit: true });
        console.log(result);
        return res.json(result.rows);
    }catch(err){
        console.log(err);
        return res.json({success : false, msg: err.message}); 
    }finally{
        await connection.release();
    }
});


//Delete
router.get("/deleteUser/:id", auth.verifyToken, async(req, res) =>{
  let connection;
    try{
        connection = await oracledb.getConnection(connAttr);
        let id = req.params.id;
        console.log(id);
        let query = 'Delete  from "USER"  where ID = ' + id ;       
        const result = await connection.execute(query, {}, {autoCommit: true });
        console.log(result);
        return res.json(result.rows);
    }catch(err){
        console.log(err);
        return res.json({success : false, msg: err.message}); 
    }finally{
        await connection.release();
    }
});


//Update
router.get("/updateUser/:id", auth.verifyToken, async(req, res) =>{
  let connection;
    try{
      connection = await oracledb.getConnection(connAttr);
      let id = req.params.id;
      let query =
          'Update "USER" set EMAIL = :EMAIL , PASSWORD = :PASSWORD , PHONE = :PHONE , ADDRESS = :ADDRESS , FIRST_NAME = :FIRST_NAME , LAST_NAME = :LAST_NAME where id = '+ id;
      let binds = [
          req.body.EMAIL,
          req.body.PASSWORD,
          req.body.PHONE,
          req.body.ADDRESS,
          req.body.FIRST_NAME,
          req.body.LAST_NAME
      ];
     
        const result = await connection.execute(query, binds, {autoCommit: true });
        console.log(result);
        return res.json(result.rows);
    }catch(err){
        console.log(err);
        return res.json({success : false, msg: err.message}); 
    }finally{
        await connection.release();
    }
});




module.exports = router;