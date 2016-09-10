'use strict';

const express = require('express');
let app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('./lib/promise');
const path = require('path');
const cors = require('cors');
mongoose.Promise = Promise;

const eventRouter = require('./routes/event-router');

const serverPort = process.env.PORT || 3000;
const mongoDatabase = process.env.MONGODB_URI || 'mongodb://localhost/eventureTestDB';

mongoose.connect(mongoDatabase);

app.use(morgan('dev'));
app.use(cors());

app.use('/api', eventRouter);
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

module.exports = exports = app.listen(serverPort, () => console.log('Server running on ' + serverPort));
