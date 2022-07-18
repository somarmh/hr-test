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
router.get("/getEvents", auth.verifyToken, async(req, res) =>{
  let connection;
  try{
      connection = await oracledb.getConnection(connAttr);
      let query = 'SELECT ID, USER_ID, EVENT_DATE , TITLE FROM "EVENT" ';
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
router.post("/addEvent", auth.verifyToken, async(req, res) =>{
  let connection;
    try{
        connection = await oracledb.getConnection(connAttr);
        let query =
          'insert into "EVENT" (USER_ID , EVENT_DATE , TITLE ) values( :USER_ID , :EVENT_DATE , :TITLE )';
        let binds = [
            req.body.USER_ID,
            req.body.EVENT_DATE,
            req.body.TITLE,
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
router.get("/deleteEvent/:id", auth.verifyToken, async(req, res) =>{
  let connection;
  try{
      connection = await oracledb.getConnection(connAttr);
      let id = req.params.id;
      console.log(id);
      let query = 'Delete  from "EVENT"  where ID = ' + id ;
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
router.post("/updateEvent/:id", auth.verifyToken, async(req, res) =>{
  let id = req.params.id;
  let connection;
  try{
    connection = await oracledb.getConnection(connAttr);
    let query =
          'Update "EVENT" set USER_ID = :USER_ID , EVENT_DATE = :EVENT_DATE , TITLE = :TITLE  where id = '+ id;

      let binds = [
            req.body.USER_ID,
            req.body.EVENT_DATE,
            req.body.TITLE,
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