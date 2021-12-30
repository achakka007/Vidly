const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    // console.log(process.env);
    const db = process.env.vidly_db ? process.env.vidly_db : config.get('db');
    console.log('db connection str=' + db)
    mongoose.connect(db, { useNewUrlParser: true.valueOf, useUnifiedTopology: true })
        .then(() => winston.info(`Connected to ${db}`))
}