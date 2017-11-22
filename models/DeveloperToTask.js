const mongoose = require('mongoose');
const DeveloperToTask = new mongoose.Schema({
    developer_id: {
      type: String,
      required: true
    },
    task_id: {
      type: String,
      required: true
    }
})

module.exports = mongoose.model('DeveloperToTask', DeveloperToTask);
