const express = require('express');
const auth = require('../routes/auth');
const genres = require('../routes/genres');
const home = require('../routes/home');
const users = require('../routes/users');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
    app.use('/vidly/movies', movies);
    app.use('/vidly/genres', genres);
    app.use('/vidly/customers', customers)
    app.use('/vidly/rentals', rentals)
    app.use('/vidly/users', users)
    app.use('/vidly/auth', auth)
    app.use('/vidly/returns', returns)
    app.use('/', home);
    app.use(error);
}