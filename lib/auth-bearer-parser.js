'use strict';

const jwt = require('jsonwebtoken');
const User = require('../model/User');
const httpError = require('http-errors');

module.exports = function(req, res, next) {
  new Promise((resolve, reject) => {
    let authHeader = req.headers.authorization;
    if (!(typeof authHeader === 'string'))
      return reject(httpError(401, 'no auth token'));
    authHeader = authHeader.split(' ');
    if (authHeader[0] !== 'Bearer')
      return reject(httpError(401, 'no auth bearer token'));

    let decoded = jwt.verify(authHeader[1], process.env.APP_SECRET);

    if (!decoded)
      return reject(httpError(401, 'auth token invalid'));

    User.findOne({ 'basic.findHash': decoded.idd })
    .then((user) => {
      if (!user)
        return reject(httpError(404, 'user not found'));
      req.user = user;
      resolve(user);
      next();
    })
    .catch(err => reject(err));
  })
  .catch(err => next(err)); // instead of catching into next, we can replace the rejects within the promise to be next, just testing stuffs
};
