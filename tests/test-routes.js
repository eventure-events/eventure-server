'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');

const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;

let app = require('./test-server');

let server;

describe('testing server routes ', () => {
  before((done) => {
    server = app.listen(5000, ()=>{
      console.log('Server on 5000');
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
      .send({username:'testuser', password:'testpassword', email:'test@email.com', name:'testname'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });
});
