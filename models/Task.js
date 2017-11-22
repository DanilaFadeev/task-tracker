const mongoose = require('mongoose');
const Task = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    details: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["waiting", "implementation", "verifying", "releasing"]
    },
    created_at: {
      type: Date,
      require: true
    },
    project_id: {
      type: String,
      require: true
    }
})

module.exports = mongoose.model('Task', Task);
