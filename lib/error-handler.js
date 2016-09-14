'use strict';

module.exports = function(err, req, res, next) {
  console.error(err);
  if (err.status) { // if it has a status it's an instance of http-errors
    res.status(err.status).send(err.name);
    next();
  } else {
    res.status(500).send('internal server problem');
  }
};
