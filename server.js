'use strict';

const express = require('express');
let app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('./lib/promise');
const path = require('path');
mongoose.Promise = Promise;

const serverPort = process.env.PORT || 3000;
const mongoDatabase = process.env.MONGODB_URI || 'mongodb://localhost/eventureTestDB';

mongoose.connect(mongoDatabase);

app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

module.exports = exports = app.listen(serverPort, () => console.log('Server running at http://localhost:' + serverPort));
