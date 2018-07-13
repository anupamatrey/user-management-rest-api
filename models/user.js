
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 100 },
    password: { type: String, required: true, maxlength: 255 },
    userId: { type: String, required: true, maxlength: 100 },
    creationDate: { type: Date, default: Date.now },
    accountStatus: Boolean,
    lastLogin: { type: Date, default: Date.now }
});
console.log('****************************************************************');
console.log('User Schema Build Sucessfully');

userSchema.methods.generateAuthTokens = function () {
    const jwtToken = jwt.sign({ email: this.email }, config.get('jwtPrivateKey'));
    return jwtToken;
}

module.exports = mongoose.model('User', userSchema);