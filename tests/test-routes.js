'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');
const UserSchema = require('../models/User');

const TESTING_SERVER = 'mongodb://localhost/dev';
process.env.DB_SERVER = TESTING_SERVER;

let app = require('./test-server');

describe('CRUD tests', () => {
  let userToken, newUser;
  beforeEach(function(done){
    app.listen(5000, () => {
      console.log('Server up on 5000');
    });
    mongoose.connection.db.dropDatabase(()=>{
      mongoose.disconnect(() => {
        app.close();
      });
    });
    newUser = UserSchema({username:'testuser', password: 'testpassword', name: 'testname', email: 'testemail'});
    newUser.save();
    done();
  });

  it('should POST a new user', (done) => {
    request('localhost:5000')
      .post('/api/signup')
      .send({username:'user', password:'password', email:'email@email.com', name:'name'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should GET a user', function(done){
    request('localhost:5000')
      .get('/api/signin')
      .auth('test2user', 'test2password')
      .end((err, res) => {
        userToken = res.body.token;
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should not GET a user - no credentials', (done) => {
    request('localhost:5000')
      .get('/api/signin')
      .end((err, res) => {
        expect(err).to.be('username or password not provided');
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should POST a new event', function(done){
    request('localhost:5000')
      .post('/api/event')
      .set('Authorization', 'Bearer ' + userToken)
      .send({name: 'testparty', visibility: 'public', location: 'code fellows', description: 'partyoverhere'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should not POST a new event', function(done){
    request('localhost:5000')
      .post('/api/event')
      .set('Authorization', 'Bearer' + 'wrong')
      .send({name: 'test party', visibility: 'public', location: 'code fellows', description: 'party over here'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should not DELETE an event', function(done){
    request('localhost:5000')
      .delete('/api/event')
      .set('Authorization', 'Bearer' + 'wrong')
      .send({name: 'test party', visibility: 'public', location: 'code fellows', description: 'party over here'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(404);
        done();
      });
  });

});
