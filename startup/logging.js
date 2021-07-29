const winston = require('winston');
require('express-async-errors') // In case async functions have errors.
require('winston-mongodb');

module.exports = function() {
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly',level: 'info', tryReconnect: true}));
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true}));

    winston.exceptions.handle(new winston.transports.File({ filename: 'logfile.log' }));


    process.on('unhandledRejection', (ex) => {
        throw(ex);
    });
}