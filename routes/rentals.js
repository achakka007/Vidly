const auth = require('../middleware/auth');
const Fawn = require('fawn');
const validate = require('../middleware/validate');
const {Rental, validator} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', [auth, validate(validator)], async (req, res) => {
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) res.status(404).send('Invalid Customer');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) res.status(404).send('Invalid Movie');

    if (movie.numberInStock === 0) res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {
                $inc: {numberInStock: -1}
            })
        .run();

        res.send(rental);
    }
    catch(ex) {
        res.status(500).send('Something failed')
    }
    
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('Rental w/ given id not found.');
    res.send(rental);
});

router.put('/:id', [auth, validate(validator)], async (req, res) => {
    const rental = await Rental.findByIdAndUpdate(req.params.id, {title: req.body.title },{
            new: true
        });
    if (!rental) return res.status(404).send('Rental w/ given id not found.');
    
    res.send(rental);
});

router.delete('/:id', auth, async (req, res) => {
    const rental = await Rental.findByIdAndRemove({_id: req.params.id});
    if (!rental) return res.status(404).send('Rental w/ given id not found.');
    res.send(rental);
});

module.exports = router;