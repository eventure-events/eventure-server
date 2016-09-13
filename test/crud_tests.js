'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const baseUrl = 'localhost:5000/api';
const User = require('../models/User');

describe('CRUD tests', function() {
  let userToken;

  before(function(done) {
    this.newUser = new User({
      username: 'testuser',
      basic: {
        name: 'testname',
        email: 'test@email.com',
        password:'testpassword',
      },
    }),
    done();
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
        userToken = res.body.token;
        console.log('userToken: ', userToken);
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
    console.log('userToken.token: ', userToken.token);
    request(baseUrl)
      .post('/event')
      .set('Authorization', 'Bearer ' + userToken.token)
      .send({name: 'testparty', visibility: 'public', location: 'code fellows', description: 'partyoverhere'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });
  //
  // it('should not POST a new event', function(done){
  //   request(baseUrl)
  //     .post('/event')
  //     .set('Authorization', 'Bearer' + 'wrong')
  //     .send({name: 'test party', visibility: 'public', location: 'code fellows', description: 'party over here'})
  //     .end((err, res) => {
  //       expect(err).to.eql(null);
  //       expect(res).to.have.status(404);
  //       done();
  //     });
  // });

});
