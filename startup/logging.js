const winston = require('winston');
require('express-async-errors') // In case async functions have errors.
require('winston-mongodb');

module.exports = function() {
    const db = config.get('db');
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.MongoDB({ db: db, level: 'info'}));
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true}));

    winston.exceptions.handle(new winston.transports.File({ filename: 'logfile.log' }));


    process.on('unhandledRejection', (ex) => {
        throw(ex);
    });
}