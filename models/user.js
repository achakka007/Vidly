const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    isAdmin: Boolean
})
userSchema.methods.generateAuthToken = function() { // No Arrow function because "this" is needed
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().required(),
        password: Joi.string().required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validator = validateUser;