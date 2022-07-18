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
router.get("/getComments", auth.verifyToken, async(req, res) =>{
  let connection;
  try{
      connection = await oracledb.getConnection(connAttr);
      let query = 'SELECT ID, POST_ID, WRITER_ID, TEXT FROM "COMMENT" ';
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
router.post("/addComment", auth.verifyToken, async(req, res) =>{
  let connection;
    try{
        connection = await oracledb.getConnection(connAttr);
        let query =
          'insert into "COMMENT" (POST_ID , WRITER_ID , TEXT) values( :POST_ID , :WRITER_ID , :TEXT )';
        let binds = [
          req.body.POST_ID,
          req.body.WRITER_ID,
          req.body.TEXT,
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
router.get("/deleteComment/:id", auth.verifyToken, async(req, res) =>{
  let connection;
  try{
      connection = await oracledb.getConnection(connAttr);
      let id = req.params.id;
      console.log(id);
      let query = 'Delete  from "COMMENT"  where ID = ' + id ;
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
router.post("/updateComment/:id", auth.verifyToken, async(req, res) =>{
  let id = req.params.id;
  let connection;
  try{
    connection = await oracledb.getConnection(connAttr);
    let query =
          'Update "COMMENT" set POST_ID = :POST_ID , WRITER_ID = :WRITER_ID , TEXT = :TEXT  where id = '+ id;

      let binds = [
          req.body.POST_ID,
          req.body.WRITER_ID,
          req.body.TEXT,
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