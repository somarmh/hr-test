const express = require('express')
const oracledb = require('oracledb');
const auth = require("../middleware/auth");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let router = express.Router();

const dbconnection = require("../config/db_config");
let connAttr = dbconnection.connAttr;

// ...
//CRUD

//Read
router.get("/getTimeLinePost", auth.verifyToken, async(req, res) =>{
  let connection;
  try{
      connection = await oracledb.getConnection(connAttr);
      let query = 'SELECT ID, POST_ID, USER_ID FROM "Timeline Post" ';
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
router.post("/createTimeLinePost", auth.verifyToken, async(req, res) =>{
  let connection;
  try{
      connection = await oracledb.getConnection(connAttr);
      let query ='insert into "Timeline Post" (POST_ID , USER_ID) values( :POST_ID , :USER_ID )';
      let binds = [
          req.body.POST_ID,
          req.body.USER_ID,
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
router.get("/deleteTimeLinePost/:id", auth.verifyToken, async(req, res) =>{
  let connection;
  try{
      connection = await oracledb.getConnection(connAttr);
      let id = req.params.id;
      console.log(id);
      let query = 'Delete from "Timeline Post"  where ID = ' + id ;
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
router.post("/updateTimeLinePost/:id", auth.verifyToken, async(req, res) =>{
  let id = req.params.id;
  let connection;
  try{
    connection = await oracledb.getConnection(connAttr);
    let query ='Update "Timeline Post" set POST_ID = :POST_ID , USER_ID = :USER_ID where id = '+ id;
    let binds = [
      req.body.POST_ID,
      req.body.USER_ID,
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