const express = require('express')
const jwt = require('jsonwebtoken')
const mwares = require('../sevices/action')

let router = express.Router();

module.exports = router;

router.get("/" , mwares.testMiddleware, function(req, res){
    let myParam = res.locals.myParam;
    let intValue = Number(myParam);

    return res.json({message : intValue});
})

router.post("/sum" , function(req, res){
    let myParam = req.body.myParam;
    let intValue = Number(myParam) + 5;
    myParam += 2;
    return res.json({value : intValue});
})

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userDetails = {email : email, role: "admin"};//from database
    const secretKey= "123456789";
    const secretKeyRefresh = "asdfghj";
    try{
        const token = await jwt.sign(userDetails, secretKey, {expiresIn:10000})
        const refreshToken = await jwt.sign(userDetails, secretKeyRefresh, {expiresIn:864000})
        return res.json({success:true, accessToken: token, refreshToken: refreshToken});
    } catch(err){
        console.log(err);
        return  res.json({success:false, msg: err.message})
    }
});