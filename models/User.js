const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
    email : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    name : {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['manager', 'developer'],
      require: true
    }
});

module.exports = mongoose.model('User', User);
