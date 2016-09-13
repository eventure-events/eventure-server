'use strict';

const ADMIN = 'admin';
const BASIC = 'basic';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Eventure = require('../models/Event');
const httpError = require('http-errors');
const authBearerParser = require('../lib/auth-bearer-parser');
const authorization = require('../lib/authorization');

const eventRouter = module.exports = exports = Router();

eventRouter.post('/', jsonParser, authBearerParser, authorization([BASIC]), (req, res, next) => {
  const newEvent = new Eventure(req.body);
  newEvent.userId = req.user._id;
  newEvent.username = req.user.username;
  newEvent.save((err, evnt) => {
    if (err) {
      return console.log(err);
    }
  })
    .then((evnt) => {
      res.json(evnt);
    })
    .catch(next);
});

eventRouter.get('/public', (req, res, next) => {
  console.log('request: GET /event :: all events');
  Eventure.find({visibility: 'public'})
  .then((all) => {
    if (!all) {
      return next(httpError(404, 'No events found.'));
    }
    res.json(all);
  }).catch(next);
});

// eventRouter.get('/testGet', (req, res, next) => {
//   const searchQueries = {
//     'visibility': 'public',
//     'description': 'test event',
//   };
//   Eventure.find(searchQueries)
//     .exec()
//     .then(function(foundEvents) {
//       res.json(foundEvents);
//     })
//     .catch(next);
// });

eventRouter.get('/user/:username/all', (req, res, next) => {
  
});

eventRouter.get('/public', (req, res, next) => {
  console.log('request: GET /event :: all events');
  Eventure.find({visibility: 'public'}).then((all) => {
    if (!all) {
      return next(httpError(404, 'No events found.'));
    }
    res.json(all);
  })
  .catch(next);
});

eventRouter.get('/:id', (req, res, next) => {
  console.log('request: GET /event' + req.params.id);
  Eventure.findById({
    '_id': req.params.id,
  })
    .then((evnt) => {
      if (!evnt) {
        return next(httpError(404, 'No event found.'));
      }
      res.json(evnt);
    })
    .catch(next);
});

// have to check userId and verify that the same user is attempting to modify it
eventRouter.put('/:id', jsonParser, authBearerParser, authorization([BASIC]), (req, res, next) => {
  console.log('request: PUT /event' + req.params.id);
  Eventure.findById(req.params.id)
  .then(ev => {
    if (!ev) {
      return next(httpError(404, 'No such event found'));
    }

    if (!ev.userId.equals(req.user._id)) {
      return next(httpError(401, 'Not authorized to do so'));
    }

    Eventure.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(ev => {
      res.json(ev);
    });
  })
  .catch(next);
});

// have to check createdBy and verify that the same user is attempting to modify it
eventRouter.delete('/:id', jsonParser, authBearerParser, authorization([BASIC]), (req, res, next) => {
  console.log('request: DELETE /event' + req.params.id);
  Eventure.findById(req.params.id)
  .then(ev => {
    if (!ev) {
      return next(httpError(404, 'No such event found'));
    }

    if (!ev.userId.equals(req.user._id)) {
      return next(httpError(401, 'Not authorized to do so'));
    }

    Eventure.findByIdAndRemove(req.params.id)
    .then(ev => {
      res.json(ev);
    });
  })
    .catch(next);
});
