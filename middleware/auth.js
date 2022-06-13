const jwt = require('jsonwebtoken');
const { secretKey } = require('../app/config/auth_config');

const verifyToken = (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] == 'Bearer'){
        token = req.headers.authorization.split(' ')[1];
    }else{
        return res.json({success: false, msg: "No token Provided"})
    }

    if(!token){
        return res.json({success: false, msg: "No token Provided"})
    }
    jwt.verify(token, secretKey, (err, decoded) =>{
        if(err){
            return res.json({success: false, msg: err.message}) 
        }
        console.log(decoded) ;
        res.locals.decodedToken = decoded;
        req.email = decoded.email;
        next();
    });
};

const authJwt = {
    verifyToken,
};
module.exports = authJwt;
