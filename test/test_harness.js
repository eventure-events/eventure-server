process.env.APP_SECRET = 'test';
require('./test_server');
require('./crud_tests');

const mongoose = require('mongoose');
process.on('exit', (cb) => {
  mongoose.connection.db.dropDatabase(() => console.log('db dropped'));
});
