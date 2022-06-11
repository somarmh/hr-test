const express = require('express');
const { json } = require('express/lib/response');
const res = require('express/lib/response');
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const dbconnection = require('../../config/db');
const auth = require('../auth/auth');

var router = express.Router();

let connAttr = dbconnection.connAttr;

/*
router.get('/', function(req,res){
    oracledb.getConnection(connAttr, function(err, connection){
        if(err){
            console.log(err);
            return res.json({success : false, msg: err.message})
        }
        console.log("Connected to Database");
        let query = "select * from employees";
        connection.execute(query, {}, {}, function(err,result){
            console.log("Exceuting query....")
            if(err){
                console .log(err);
                return res.json({success : false, msg: err.message}); 
            }
            connection.release(function(err){
                console.log("connection is released");
            });
            return res.json(result.rows);
        });
    });
})*/

router.get('/', auth.verifyToken, async (req,res ) =>{
    const decodedToken = res.locals.decodedToken;
    const email = decodedToken.email;
    if(email == "email"){
        let connection;
        try{
            connection = await oracledb.getConnection(connAttr);
            let query = "select * from employees";
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


router.post("/add", function(req, res){
    oracledb.getConnection(connAttr, function(err, connection){
     let query = 'INSERT INTO employees( EMPLOYEE_ID, FIRST_NAME, LAST_NAME, PHONE_NUMBER, EMAIL, HIRE_DATE, JOB_ID, SALARY, MANAGER_ID, DEPARTMENT_ID ) \
     VALUES( :EMPLOYEE_ID, :FIRST_NAME, :LAST_NAME, :PHONE_NUMBER, :EMAIL, :HIRE_DATE, :JOB_ID, :SALARY, :MANAGER_ID, :DEPARTMENT_ID )';
      console.log("Database Connected succesfully...");
      //let query = "INSERT INTO employees ( EMPLOYEE_ID, FIRST_NAME, LAST_NAME, PHONE_NUMBER, EMAIL, HIRE_DATE, JOB_ID, SALARY, MANAGER_ID, DEPARTMENT_ID ) VALUES(" +  req.body.EMPLOYEE_ID + ",'" + req.body.FIRST_NAME + "','" + req.body.LAST_NAME + "','" +  req.body.PHONE_NUMBER + "','" + req.body.EMAIL + "','" + req.body.HIRE_DATE + "','" + req.body.JOB_ID + "'," + req.body.SALARY + "," + req.body.MANAGER_ID + "," + req.body.DEPARTMENT_ID + ")";
      let binds = [req.body.EMPLOYEE_ID ,
                  req.body.FIRST_NAME, 
                  req.body.LAST_NAME,                    
                  req.body.PHONE_NUMBER,
                  req.body.EMAIL, 
                  req.body.HIRE_DATE, 
                  req.body.JOB_ID, 
                  req.body.SALARY, 
                  req.body.MANAGER_ID, 
                  req.body.DEPARTMENT_ID ];
                  console.log(binds);
      connection.execute(query, binds,{ autoCommit: true }, function(err, result){
        //console.log(result.rows);
        if(err) {
          console.log(err);
        }
        connection.release(function(err){
          console.log("connection is  releasesd")
        });
        console.log(result);
        return res.json({success: "true", employees: result});
      });
      
    });
  });



module.exports = router;