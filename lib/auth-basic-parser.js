'use strict';

const httpError = require('http-errors');

module.exports = function(req, res, next) {
  let header = req.headers.authorization;
  let basicString = header.split(' ')[1];
  let authBuffer = new Buffer(basicString, 'base64');
  let authString = authBuffer.toString();
  let authArr = authString.split(':');
  req.auth = {
    username: authArr[0],
    password: authArr[1],
  };
  authBuffer.fill(0);

  if (!req.auth.username || !req.auth.password) {
    return next(httpError(401, 'username or password not provided'));
  }

  next();
};
