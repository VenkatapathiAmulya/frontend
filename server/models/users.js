const mongoose = require('mongoose');

const schema = mongoose.Schema({
    firstName: {
    type: String,
    required: true
},
lastName: {
  type: String,
    required: true
},
username: {
  type: String,
  required: true
},
password:{
  type: String,
    required: true
},
  id: {
    type: Number,
    required: true
  },

}, {collection: 'users'})

const model = mongoose.model('task2', schema);
module.exports = model;
