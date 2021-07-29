const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {Genre, validator} = require('../models/genre');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res, next) => {
    // throw new Error('could not get genres');
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.post('/', [auth, validate(validator)], async (req, res) => {
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('Genre w/ given id not found.');
    res.send(genre);
});

router.put('/:id', [auth, validate(validator), validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name },{
            new: true
        });
    if (!genre) return res.status(404).send('Genre w/ given id not found.');
    
    res.send(genre);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndRemove({_id: req.params.id});
    if (!genre) return res.status(404).send('Genre w/ given id not found.');
    res.send(genre);
});

module.exports = router;