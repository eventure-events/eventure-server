'use strict';

const express = require('express');
let app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('../lib/promise');
const cors = require('cors');
const httpError = require('http-errors');
const errorHandler = require('../lib/error-handler');
mongoose.Promise = Promise;

const authRouter = require('../routes/auth-router');
const eventRouter = require('../routes/event-router');

process.env.APP_SECRET = 'dev secret'; //temporary

const port = process.env.PORT || 5000;
const mongoDatabase = process.env.MONGODB_URI || 'mongodb://localhost/eventureTestDB';

mongoose.connect(mongoDatabase);

app.use(morgan('dev'));
app.use(cors());

app.use('/api', authRouter);
app.use('/api/event', eventRouter);

app.all('*', (req, res, next) => {
  next(httpError(404, 'route not registered'));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
