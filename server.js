'use strict';

const express = require('express');
let app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('./lib/promise');
// const path = require('path');
const cors = require('cors');
const httpError = require('http-errors');
const errorHandler = require('./lib/error-handler');
mongoose.Promise = Promise;

const authRouter = require('./routes/auth-router');
const eventRouter = require('./routes/event-router');

process.env.APP_SECRET = 'dev secret'; //temporary

const serverPort = process.env.PORT || 3000;
const mongoDatabase = process.env.MONGODB_URI || 'mongodb://localhost/eventureTestDB';

mongoose.connect(mongoDatabase);

app.use(morgan('dev'));
app.use(cors());

app.use('/api', authRouter);
app.use('/api/event', eventRouter);
// app.get('/', (req, res) => {
//   res.sendFile(path.join(`${__dirname}/index.html`));
// });

app.all('*', (req, res, next) => {
  next(httpError(404, 'route not registered'));
});

app.use(errorHandler);

module.exports = exports = app.listen(serverPort, () => console.log('Server running on ' + serverPort));
