process.env.APP_SECRET = 'test';
require('./test_server');
require('./authentication_test');

const mongoose = require('mongoose');
process.on('exit', (code) => {
  mongoose.connection.db.dropDatabase(() => console.log('db dropped'));
});
