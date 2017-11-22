const mongoose = require('mongoose');
const Project = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    created_at: {
      type: Date,
      required: true
    },
    manager_id: {
      type: String,
      require: true
    },
    developer_ids: {
      type: Array,
      default: []
    }
})

module.exports = mongoose.model('Project', Project);
