const express = require('express')
//const jwt = require('jsonwebtoken')
//const User1 = require('../models/usermodel.js');
const auth = require("../middleware/auth");
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
router.get("/getFriendships", auth.verifyToken, async(req, res) =>{
  let connection;
  try{
      connection = await oracledb.getConnection(connAttr);
      let query = 'SELECT ID, SENDER_ID, RECIEVER_ID , STATUE FROM "FRIENDSHIP" ';
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


//CREATE
router.post("/addFriendship", auth.verifyToken, async(req, res) =>{
  let connection;
    try{
        connection = await oracledb.getConnection(connAttr);
        let query =
          'insert into "FRIENDSHIP" (SENDER_ID , RECIEVER_ID , STATUE ) values( :SENDER_ID , :RECIEVER_ID , :STATUE )';
        let binds = [
            req.body.SENDER_ID,
            req.body.RECIEVER_ID,
            req.body.STATUE,
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
router.get("/deleteFriendship/:id", auth.verifyToken, async(req, res) =>{
  let connection;
  try{
      connection = await oracledb.getConnection(connAttr);
      let id = req.params.id;
      console.log(id);
      let query = 'Delete  from "FRIENDSHIP"  where ID = ' + id ;
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
router.post("/updateFriendship/:id", auth.verifyToken, async(req, res) =>{
  let id = req.params.id;
  let connection;
  try{
    connection = await oracledb.getConnection(connAttr);
    let query =
          'Update "FRIENDSHIP" set SENDER_ID = :SENDER_ID , RECIEVER_ID = :RECIEVER_ID , STATUE = :STATUE  where id = '+ id;

      let binds = [
          req.body.SENDER_ID,
          req.body.RECIEVER_ID,
          req.body.STATUE,
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