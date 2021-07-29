const express = require('express');
const app = express();
const winston = require('winston');

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);
 

// PORT
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {winston.info(`listening on port ${port}...`);});

module.exports = server;