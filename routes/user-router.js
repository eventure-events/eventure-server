'use strict';

const ADMIN = 'admin';
const BASIC = 'basic';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Eventure = require('../models/Event');
const User = require('../models/User');
const httpError = require('http-errors');
const authBearerParser = require('../lib/auth-bearer-parser');
const authorization = require('../lib/authorization');

const userRouter = module.exports = exports = Router();

userRouter.post('/:username/follow/:followeeName', jsonParser, authBearerParser, authorization([BASIC]), (req, res, next) => {
  User.findOneAndUpdate(
    {username: req.params.username},
    {$push: {'following': req.params.followeeName}},
    {safe: true, upsert: true, new : true}
  )
  .then(user => {
    res.json(user);
  })
  .catch(next);
});
