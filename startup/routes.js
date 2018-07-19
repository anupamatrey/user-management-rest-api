const router = require('../routes/route');
const error = require('../middleware/error');
const auth = require('../routes/auth');
const express = require('express');

module.exports = function (application) {
    //Register Route
    application.use('/', router);
    application.use('/', auth);
    application.use(error);

}