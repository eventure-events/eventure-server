'use strict';

const User = require('../model/User');
const httpError = require('http-errors');

let signin = function(req) {
  return new Promise((resolve, reject) => {
    User.findOne({ username: req.auth.username })
    .then((user) => {
      if (!user)
        return reject(httpError(401, 'no such user'));

      user.comparePassword(req.auth.password)
      .then(user => user.generateToken())
      .then(token => resolve(token))
      .catch(err => reject(err));
    });
  });
};

module.exports = signin;
