const jwt = require('jsonwebtoken');
const express = require('express');
const Joi = require('joi');
const logger = require('../logger/logger');
var User = require('../models/user');
var auth = require('../middleware/auth');
var admin = require('../middleware/admin');
var jsonxml = require('jsontoxml');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
var router = express.Router();
router.use(logger);

router.get('/user/v1', (req, res) => {
    res.json({ message: 'User Management Rest API Version 1.0' });
});

router.get('/user/v2', (req, res) => {
    res.json({ message: 'User Management Rest API Version 2.0' });
});

router.route('/api/login')
    .post(async function (req, res) {
        console.log('********** Login User **************');
        const schema = {
            password: Joi.string().required().min(5).max(255),
            email: Joi.string().required()
        }

        const result = Joi.validate(req.body, schema);

        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        let user = new User(
            {
                password: req.body.password,
                email: req.body.email
            }
        )

        try {
            let userExist = await User.findOne({ email: req.body.email });
            if (!userExist)
                return res.status(400).send('Invalid Email or Password.');
            const validUser = await bcrypt.compare(req.body.password, userExist.password);
            if (!validUser)
                return res.status(400).send('Invalid Email or Password.');
            else
                console.log('********** User Login sucessfully **************');
            //const jwtToken = jwt.sign({ email: user.email }, config.get('jwtPrivateKey'));
            const jwtToken = userExist.generateAuthTokens();
            res.send(jwtToken);
        } catch (ex) {
            console.log(ex.message);

        }
    })
router.route('/api/login/v1')
    .post([auth,admin], async function (req, res) {
        console.log('********** Login User **************');
        const schema = {
            password: Joi.string().required().min(5).max(255),
            email: Joi.string().required()
        }

        const result = Joi.validate(req.body, schema);

        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        let user = new User(
            {
                password: req.body.password,
                email: req.body.email
            }
        )

        try {
            let userExist = await User.findOne({ email: req.body.email });
            if (!userExist)
                return res.status(400).send('Invalid Email or Password.');
            const validUser = await bcrypt.compare(req.body.password, userExist.password);
            if (!validUser)
                return res.status(400).send('Invalid Email or Password.');
            else
                console.log('********** User Login sucessfully **************');
            //const jwtToken = jwt.sign({ email: user.email }, config.get('jwtPrivateKey'));
            const jwtToken = userExist.generateAuthTokens();
            res.send(jwtToken);
        } catch (ex) {
            console.log(ex.message);

        }
    })
module.exports = router;