const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5
    },
    phone: Number,
    isGold: {type: Boolean, default: true}
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validator = validateCustomer;