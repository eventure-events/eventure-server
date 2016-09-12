'use strict';
const httpError = require('http-errors');

module.exports = exports = function(roles) {
  roles = roles || [];
  return function(req, res, next) {
    new Promise((resolve, reject) => {
      if (!req.user)
        return reject(httpError(401, 'not logged in'));
      if (req.user.role === 'admin') return resolve();
      if (roles.indexOf(req.user.role) === -1) {
        return reject(httpError(401, 'not authorized to perform action'));
      }
      resolve();
    })
    .then(next)
    .catch(err => next(err));
  };
};
