const express = require('express')

var app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
 

const home = require('./src/home/home');
app.use('/', home);

const employee = require('./src/employee/employee');
app.use('/employee', employee);


var port = 5000;
app.listen(port, () => {
    console.log("The web server is ready on port: "+port);
});