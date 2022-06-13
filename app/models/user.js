const findOne = async (email) =>{
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
