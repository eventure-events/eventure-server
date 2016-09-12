'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const authBasicParser = require('../lib/auth-basic-parser');
const authRouter = module.exports = Router();
const signup = require('../lib/signup');
const signin = require('../lib/signin');

authRouter.post('/signup', jsonParser, (req, res, next) => {
  signup(req)
  .then(token => res.json(token))
  .catch(next);
});

authRouter.get('/signin', authBasicParser, (req, res, next) => {
  signin(req)
  .then(token => res.json(token))
  .catch(next);
});
