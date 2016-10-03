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
  newEvent.save()
  .then((evnt) => {
    res.json(evnt);
  })
  .catch(next);
});

eventRouter.get('/user/:username/all', (req, res, next) => {
  Eventure.find({username: req.params.username})
  .then((all) => {
    console.log('all: ', all[0]);
    res.json(all);
  })
  .catch(next);
});

eventRouter.get('/public', (req, res, next) => {
  console.log('request: GET /event :: all events');
  Eventure.find({visibility: 'public'})
  .then((all) => {
    //an empty array will actually return true so this will never trigger
    //what you want is all.length
    if (!all) {
      return next(httpError(404, 'No events found.'));
    }
    res.json(all);
  })
  .catch(next);
});

eventRouter.get('/followed', authBearerParser, authorization([BASIC]), (req, res, next) => {
  console.log('request: GET /followed :: followed people events');
  Eventure.find({ username: { $in: req.user.following } })
  .exec()
  .then(ev => {
    res.json(ev);
  })
  .catch(next);
});

eventRouter.get('/allVisible', authBearerParser, authorization([BASIC]), (req, res, next) => {
  const allVisibleEvents = [];
  //a much better way to do this would be to fire all of these at once, save the promises into an array and pass
  //them off to a Promise.all, it would make for much cleaner code as well
  Eventure.find({visibility: 'public'})
  .then(publicEvents => {
    Eventure.find({ username: { $in: req.user.following }, visibility: 'private'})
    .then(followedEvents => {
      Eventure.find({ username: req.user.username, visibility: 'private'})
      .then(yourEvents => {
        followedEvents.forEach(item => {
          allVisibleEvents.push(item);
        });

        publicEvents.forEach(item => {
          allVisibleEvents.push(item);
        });

        yourEvents.forEach(item => {
          allVisibleEvents.push(item);
        });

        res.json(allVisibleEvents);
      });
    });
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
eventRouter.delete('/:id', authBearerParser, authorization([BASIC]), (req, res, next) => {
  console.log('request: DELETE /event' + req.params.id);
  //I think you actually want a findOneById here
  Eventure.findById(req.params.id)
  .then(ev => {
    //you're going to run into the same array error here
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

eventRouter.post('/:id/comment', jsonParser, authBearerParser, authorization([BASIC]), (req, res, next) => {
  console.log('request: POST /event/:id/comment' + req.params.id);
  console.log(req.body.comment);
  const newComment = req.user.username + ': ' + req.body.comment;

  Eventure.findByIdAndUpdate(
    req.params.id,
    {$push: {'comments': newComment}},
    {new : true}
  )
  .then((ev) => {
    console.log(ev);
    res.json(newComment);
  })
  .catch(next);
});
