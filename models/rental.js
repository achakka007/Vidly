const mongoose = require('mongoose');
const moment = require('moment');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: String,
            isGold: Boolean,
            phone: Number
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: String,
            dailyRentalRate: Number,
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturned: Date,
    rentalFee: {
        type: Number,
        min: 0
    }
});
rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}
rentalSchema.methods.return = function() {
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validator = validateRental;
