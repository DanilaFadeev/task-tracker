const mongoose = require('mongoose');
const Comments = new mongoose.Schema({
    task_id: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      required: true
    },
    author_id: {
      type: String,
      require: true
    },
    author: {
      type: String,
      required: true
    }
})

module.exports = mongoose.model('Comments', Comments);
