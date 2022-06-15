

const getByEmail = async (email) =>{
    let connection;
    try{
        connection = await oracledb.getConnection(connAttr);
        let query = "select email from user where email = " + email;
        const result = await connection.execute(query);
        console.log(result);
        return result.rows;
    }catch(err){
        console.log(err);
        return null; 
    }finally{
        await connection.release();
    }
}


const add =(function(req, res){
    oracledb.getConnection(connAttr, function(err, connection){
    let query = 'INSERT INTO user( Email, Hash_passowrd, Phone, Address,FIRST_NAME, LAST_NAME) \ VALUES( :EMAIL, :Hash_password, :PHONE, :Address, :FIRST_NAME, :LAST_NAME)';
    console.log("Database Connected succesfully...");
    let binds = [req.body.FIRST_NAME ,
                req.body.LAST_NAME, 
                req.body.LAST_NAME,                    
                req.body.EMAIL, 
                req.body.PASSWORD, 
                req.body.PHONE, 
                req.body.ADDRESS, ];
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
    return res.json({success: "true", user: result});
    });
      
    });
  });
