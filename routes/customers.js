const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {Customer, validator} = require('../models/customer');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const customer = await Customer.find().sort('name');
    res.send(customer);
});

router.post('/', [auth, validate(validator)], async (req, res) => {
    let customer = new Customer({ name: req.body.name });
    customer = await customer.save();
    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('Customer w/ given id not found.');
    res.send(customer);
});

router.put('/:id', [auth, validate(validator)], async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name },{
            new: true
        });
    if (!customer) return res.status(404).send('Customer w/ given id not found.');
    
    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove({_id: req.params.id});
    if (!customer) return res.status(404).send('Customer w/ given id not found.');
    res.send(customer);
});

module.exports = router;