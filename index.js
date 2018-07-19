
const express = require('express');

const application = express();
application.use(express.json());

require('./startup/logging.js');
require('./startup/config.js')();
require('./startup/routes.js')(application);
require('./startup/db.js')();
//https://fierce-plains-86052.heroku.com/api/login/v1
//https://fierce-plains-86052.herokuapp.com/api/login


console.log('****************************************************************');
console.log('User Management Rest API with Node.js');
console.log('****************************************************************');



//throw new Error('Something failed during startup');

const port = process.env.PORT || 3000  //Set the Application Port


application.listen(port);
console.log('Server Listening at ' + port);