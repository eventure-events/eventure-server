'use strict';

const express = require('express');
let app = express();
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const mongoDatabase = process.env.MONGODB_URI || 'mongodb://localhost/eventureTestDB';

mongoose.connect(mongoDatabase);

const authRouter = require('../routes/auth-router');
const eventRouter = require('../routes/event-router');

process.env.APP_SECRET = 'dev secret'; //temporary

app.use('/api', authRouter);
app.use('/api/event', eventRouter);

module.exports = exports = app;
