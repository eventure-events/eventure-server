'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = Schema({
  name: { type: String, required: true },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    required: true,
  },
  location: { type: String, required: true },
  latLong: {lat: Number, lng: Number},
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  username: { type: String },
  attending: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  eventPic: {type: String},
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
