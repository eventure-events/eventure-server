'use strict';

const User = require('../models/User');
const httpError = require('http-errors');

let signin = function(req) {
  return new Promise((resolve, reject) => {
    User.findOne({ username: req.auth.username })
    .then((user) => {
      if (!user)
        return reject(httpError(401, 'no such user'));

      user.comparePassword(req.auth.password)
      .then(user => user.generateToken())
      .then(token => resolve({user: {name: user.basic.name, email: user.basic.email, following: user.following}, token:token}))
      .catch(err => reject(err));
    });
  });
};

module.exports = signin;
