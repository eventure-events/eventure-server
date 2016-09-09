'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = Schema({
  name: { type: String },
  visibility: {
    type: String,
    enum: ['public', 'private'],
  },
  location: { type: String },
  description: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  attending: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});


eventSchema.methods = {
  addAttending: function(userId) {
    this.attending.push(userId);
  },

  removeAttending: function(userId) {
    this.attending.forEach((removeId, idx) => {
      if(removeId === userId) {
        this.attending.splice(idx, 1);
      }
    });
  },
};

module.exports = mongoose.model('Event', eventSchema);
