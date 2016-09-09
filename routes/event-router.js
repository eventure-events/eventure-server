'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Event = require('../models/Event');

let eventRouter = module.exports = exports = Router();

eventRouter.post('/event', jsonParser, (req, res) => {
  let newEvent = new Event();
  newEvent.name = req.body.name;
  newEvent.visibility = req.body.visibility;
  newEvent.location = req.body.locaction;
  newEvent.description = req.body.description;

  newEvent.save((err, event) => {
    if (err) return console.log(err);
    console.log(event);
  })
  .then((event) => {
    res.json(event);
  });
});
