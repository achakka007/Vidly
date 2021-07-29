const mongoose = require('mongoose');
const Joi = require('joi');

genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });

    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validator = validateGenre;
exports.genreSchema = genreSchema;
