'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Eventure = require('../models/Event');
const httpError = require('http-errors');

let eventRouter = module.exports = exports = Router();

// no messages visible in httpie
// error handling doesn't intercept mongo errors

eventRouter.post('/event', jsonParser, (req, res, next) => {
  console.log('request: POST /event');
  let newEvent = new Eventure(req.body);
  newEvent.createdBy = req.body.userId;
  newEvent.save((err, evnt) => {
    if (err) {
      return console.log(err);
    }
    console.log(evnt);
  })
    .then((evnt) => {
      res.json(evnt);
    }).catch(next);
});

eventRouter.get('/event/public', (req, res, next) => {
  console.log('request: GET /event :: all events');
  Eventure.find({visibility: 'public'}).then((all) => {
    if (!all) {
      return httpError(404, 'No events found.');
    }
    res.json(all);
  }).catch(next);
});

eventRouter.get('/event/:id', (req, res, next) => {
  console.log('request: GET /event' + req.params.id);
  Eventure.findById({
    '_id': req.params.id,
  })
    .then((evnt) => {
      if (!evnt) {
        return httpError(404, 'No event found.');
      }
      res.json(evnt);
    }).catch(next);
});

eventRouter.put('/event/:id', jsonParser, (req, res, next) => {
  console.log('request: PUT /event' + req.params.id);
  Eventure.findByIdAndUpdate({
    '_id': req.params.id,
  }, req.body, {
    new: true,
  })
    .then((evnt) => {
      if (!evnt) {
        return httpError(404, 'No event found.');
      }
      res.json(evnt);
    }).catch(next);
});

eventRouter.delete('/event/:id', jsonParser, (req, res, next) => {
  console.log('request: DELETE /event' + req.params.id);
  Eventure.findByIdAndRemove({
    '_id': req.params.id,
  })
    .then((evnt) => {
      if (!evnt) {
        return httpError(404, 'No event found.');
      }
      res.json(evnt);
    }).catch(next);
});
