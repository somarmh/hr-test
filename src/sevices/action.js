const testMiddleware = (req, res, next) => {
    const myParam = req.body.myParam;
    res.locals.myParam = Number(myParam) + 10;
    next(); 
}

const mwares = {testMiddleware};

module.exports = mwares; 