const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserTemp = new mongoose.Schema({
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
    },
    confirmKey: {
      type: String,
      require: true
    }
});

const generateToken = function() {
    return Math.random().toString(36).substr(2);
};

UserTemp.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    user.confirmKey = generateToken() + generateToken();

    next();
  })
});

module.exports = mongoose.model('UserTemp', UserTemp);
