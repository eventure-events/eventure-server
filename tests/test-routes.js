'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');

const TESTING_SERVER = 'mongodb://localhost/testing_db';
process.env.DB_SERVER = TESTING_SERVER;

let app = require('./test-server');

let server, userToken;

describe('testing server routes ', () => {
  before((done) => {
    server = app.listen(5000, () => {
      console.log('Server on 5000');
      // request('localhost:5000')
      //   .post('/api/signup')
      //   .send({username:'testuser', password:'testpassword', email:'test@email.com', name:'testname'})
      //   .end();
      done();
    });
  });
  after((done) =>{
    mongoose.connection.db.dropDatabase(()=>{
      mongoose.disconnect(() => {
        server.close();
        done();
      });
    });
  });

  it('should POST a new user', (done) => {
    request('localhost:5000')
      .post('/api/signup')
      .send({username:'test2user', password:'test2password', email:'test2@email.com', name:'test2name'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should GET a user', (done) => {
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

  it('should POST a new event', (done) => {
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

  it('should not POST a new event', (done) => {
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

});
