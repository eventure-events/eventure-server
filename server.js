'use strict';

const express = require('express');
let app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('./lib/promise');
mongoose.Promise = Promise;

const serverPort = process.env.PORT || 3000;
const mongoDatabase = process.env.MONGO_URI || 'mongodb://localhost/eventureTestDB';

mongoose.connect(mongoDatabase);

app.use(morgan('dev'));

module.exports = exports = app.listen(serverPort, () => console.log('Server running at http://localhost:' + serverPort));
