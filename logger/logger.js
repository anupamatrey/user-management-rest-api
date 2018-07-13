function log(req, res, next) {
    // do logging
    console.log('Logger.....');
    next(); // make sure we go to the next routes and don't stop here
}

module.exports = log;