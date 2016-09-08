'use strict';

const express = require('express');
let app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('./lib/promise');
mongoose.Promise = Promise;
const serverPort = 3000;

const mongoDatabase = 'mongodb://localhost/mongoDatabase';

mongoose.connect(mongoDatabase);

app.use(morgan('dev'));

module.exports = exports = app.listen(serverPort, () => console.log('Server running at http://localhost:' + serverPort));
