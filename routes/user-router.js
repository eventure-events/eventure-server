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

userRouter.get('/all', authBearerParser, authorization([BASIC]), (req, res, next) => {
  User.find()
  .then(users => {
    res.json(users);
  })
  .catch(next);
});

userRouter.get('/:username', authBearerParser, authorization([BASIC]), (req, res, next) => {
  User.findOne({username: req.params.username})
  .then(user => {
    res.json(user);
  })
  .catch(next);
});

userRouter.post('/:username/follow/:followeeName', authBearerParser, authorization([BASIC]), (req, res, next) => {
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
