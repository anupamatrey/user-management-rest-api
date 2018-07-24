const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
    //MongoDB Setup
    mongoose.connect('mongodb://<User>:<Password>@ds247699.mlab.com:47699/product')
        .then(() => winston.info('************************** MongoDB Connect Sucessfully ******************************'));
}