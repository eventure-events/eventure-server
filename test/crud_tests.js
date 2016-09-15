'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const baseUrl = 'localhost:5000/api';
const User = require('../models/User');
const Event = require('../models/Event');

describe('CRUD tests', function() {
  let newEvent, newUser;
  before(function(done) {
    newUser = new User({
      username: 'testuser',
      basic: {
        name: 'testname',
        email: 'test@email.com',
        password:'testpassword',
      },
    });
    newUser.generateHash(newUser.basic.password)
    .then(newUser => newUser.save()) // http error for duplicated username here
    .then(newUser => newUser.generateToken())
    .then(token => {
      this.token = token.token;
      newEvent = new Event({
        name: 'testevent',
        visibility: 'public',
        location: 'Seattle, WA',
        description: 'testdescription',
      });
      done();
    });

  });

  after((done) => {
    User.remove({});
    done();
  });

  it('should POST a new user', function(done){
    request(baseUrl)
      .post('/signup')
      .send({username:'user', password:'password', email:'email@email.com', name:'name'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should GET a user', function(done){
    request(baseUrl)
      .get('/signin')
      .auth('user', 'password')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should not GET a user - no credentials', (done) => {
    request(baseUrl)
      .get('/signin')
      .auth('wrong', 'wrong')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should POST a new event', function(done){
    request(baseUrl)
      .post('/event')
      .set('Authorization', 'Bearer ' + this.token)
      .send({name: 'testparty', visibility: 'public', location: 'code fellows', description: 'partyoverhere'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should not POST a new event', function(done){
    request(baseUrl)
      .post('/event')
      .set('Authorization', 'Bearer' + 'wrong')
      .send({name: 'test party', visibility: 'public', location: 'code fellows', description: 'party over here'})
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should GET all events', function(done){
    request(baseUrl)
      .get('/event/public')
      .auth('user', 'password')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  // it('should DELETE an event', function(done){
  //   request(baseUrl)
  //     .delete('/event/' + newEvent._id)
  //     .auth('user', 'password')
  //     .set('Authorization', 'Bearer' + this.token)
  //     .end((err, res) => {
  //       expect(err).to.eql(null);
  //       expect(res).to.have.status(200);
  //       done();
  //     });
  // });

  it('should not DELETE an event', function(done){
    request(baseUrl)
      .delete('/event/' + newEvent._id)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should GET all events', function(done){
    request(baseUrl)
      .get('/event/user/' + newUser.username + '/all')
      .set('Authorization', 'Bearer' + this.token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  // it('should GET all users', function(done){
  //   request(baseUrl)
  //     .get('/user/all')
  //     .set('Authorization', 'Bearer' + this.token)
  //     .end((err, res) => {
  //       expect(err).to.eql(null);
  //       expect(res).to.have.status(200);
  //       done();
  //     });
  // });

  // it('should GET followed events', function(done){
  //   request(baseUrl)
  //     .get('/event/followed')
  //     .set('Authorization', 'Bearer' + this.token)
  //     .end((err, res) => {
  //       expect(err).to.eql(null);
  //       expect(res).to.have.status(200);
  //       done();
  //     });
  // });

  it('should not GET followed events', function(done){
    request(baseUrl)
      .get('/event/followed')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  // it('should GET a user', function(done){
  //   request(baseUrl)
  //     .get('/user/' + newUser.username)
  //     .set('Authorization', 'Bearer' + this.token)
  //     .end((err, res) => {
  //       expect(err).to.eql(null);
  //       expect(res).to.have.status(200);
  //       done();
  //     });
  // });

  // it('should POST following a user', function(done){
  //   request(baseUrl)
  //     .post('/user/' + newUser.username + '/follow/user')
  //     .set('Authorization', 'Bearer' + this.token)
  //     .end((err, res) => {
  //       expect(err).to.eql(null);
  //       expect(res).to.have.status(200);
  //       done();
  //     });
  // });


});
