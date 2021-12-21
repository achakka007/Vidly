const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: { type: Number, default: 10 },
    dailyRentalRate: { type: Number, default: 2 }
}));

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(5).required(),
        genreId: Joi.objectId().min(5).required(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    });

    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validator = validateMovie;
