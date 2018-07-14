const Joi = require('joi');
const config = require('config');
const express = require('express');
const morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/user');
const router = require('./routes/route');
const error = require('./middleware/error');
const auth = require('./routes/auth');
//const prod = require('./middleware/prod')(app);

//https://fierce-plains-86052.heroku.com/api/login/v1
//https://fierce-plains-86052.herokuapp.com/api/login


console.log('****************************************************************');
console.log('User Management Rest API with Node.js');
console.log('****************************************************************');

const application = express();
application.use(express.json());

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR jwtPrivateKey is not defined  ' + process.env.user_jwtPrivateKey);
    process.exit(1);
}


//Register Route
application.use('/', router);
application.use('/', auth);
application.use(error);
const port = process.env.PORT || 3000  //Set the Application Port

//MongoDB Setup
mongoose.connect('mongodb://admin:admin@ds247699.mlab.com:47699/product')
    .then(() => console.log('************************** MongoDB Connect Sucessfully ******************************'))
    .catch(err => console.log('Coould not connect to MongoDB ...', err));


const user = new User(
    {
        name: "Anupam Sharma",
        email: "anupam@gmail.com",
        password: "anupam",
        userId: "anupam12",
        accountStatus: true
    }
)

async function createUser() {
    try {
        const result = await user.save();
        console.log(result);
    } catch (ex) {
        console.log(ex.message);
    }
}

//createUser();

application.listen(port);
console.log('Server Listening at ' + port);