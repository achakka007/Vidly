const express = require('express');
const app = express();
const winston = require('winston');

console.log(1)
require('./startup/logging')();
console.log(2)
require('./startup/config')();
console.log(3)
require('./startup/routes')(app);
console.log(4)
require('./startup/db')();
console.log(5)
require('./startup/validation')();
console.log(6)
require('./startup/prod')(app);
console.log(7)
 

// PORT
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {winston.info(`listening on port ${port}...`);});

module.exports = server;