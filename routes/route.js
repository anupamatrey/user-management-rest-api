const express = require('express');
const Joi = require('joi');
const logger = require('../logger/logger');
var User = require('../models/user');
var jsonxml = require('jsontoxml');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const winston = require('winston');

//Routes Rest API
var router = express.Router();


router.get('/user/v1', (req, res) => {
    throw new Error('Something goes wrong');
    res.json({ message: 'User Management Rest API Version 1.0' });
});

router.get('/user/v2', (req, res) => {
    res.json({ message: 'User Management Rest API Version 2.0' });
});


router.route('/api/users')
    .get(async function (req, res) {
        const sort = req.query.sort;
        var user = '';
        const format = req.query.format;
        console.log(sort + " " + format);
        if (sort === 'ASC') {
            user = await User.find().sort({ name: 1 });
        } else {
            user = await User.find();

        }
        var xml = jsonxml(user);
        res.send(user);

    })
    .post(async function (req, res) {
        console.log('********** Creating User **************');
        const schema = {
            name: Joi.string().min(6).required(),
            email: Joi.string().required(),
            password: Joi.string().required().min(5).max(255),
            userId: Joi.string().required().min(5)
        }

        const result = Joi.validate(req.body, schema);

        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }


        let user = new User(
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                userId: req.body.userId,
                accountStatus: true
            }
        )

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        try {
            let userExist = await User.findOne({ email: req.body.email });
            if (userExist) return res.status(400).send('User already registred.');
            const result = await user.save();
            //const jwtToken = jwt.sign({ email: user.email }, config.get('jwtPrivateKey'));
            const jwtToken = userExist.generateAuthTokens();
            res.header('X-auth-header',jwtToken).send(_.pick(user, ['userId', 'email']));
        } catch (ex) {
            winston.error(ex.message);

        }
    })

router.route('/api/users/:userId')
    .get(async function (req, res) {
        const user = await User.find({ userId: req.params.userId }).sort({ name: 1 });
        if (user === undefined || user.length == 0) {
            res.status(404).send("User not found with given user Id");
            return;
        }
        res.send(user);
    })

module.exports = router;