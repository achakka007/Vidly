const express = require('express');
const app = express();
const winston = require('winston');

var cors = require('cors')
app.use(cors())

require('./startup/logging')();
console.log('1');
require('./startup/config')();
console.log('2');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);


// PORT
const port = process.env.PORT || 5000;
const server = app.listen(port, () => { winston.info(`listening on port ${port}...`); });
module.exports = server;