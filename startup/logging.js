const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {

    winston.handleExceptions(
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );

    process.on('uncaughtException', (ex) => {
        throw ex;
    });

    winston.add(winston.transports.File, { filename: 'logFile.log' });
   // winston.add(winston.transports.MongoDB, { db: 'mongodb://admin:admin@ds247699.mlab.com:47699/product', level: 'info' });
}