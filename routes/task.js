var express = require('express');
var router = express.Router();

const Task = require('../models/Task');
const Project = require('../models/Project');
const DeveloperToTask = require('../models/DeveloperToTask');

// middleware that is specific to this router
router.use(function(req, res, next) {
  if(!req.session.user) {
    return res.sendStatus(403);
  } else {
    next();
  }
});

// middleware for block developer
function developerCheck(req, res, next) {
  if (req.session.user.role === "developer") {
    return res.sendStatus(403);
  } else {
    next();
  }
}

router.get('/tasks/:project_id', function(req, res) {
    Task.find({ project_id: req.params.project_id }, (err, tasks) => {
      res.send(tasks);
    });
});

router.post('/tasks/:project_id', function(req, res) {
  Project.find({ _id: req.params.project_id }, function(err) {
    if (err) {
      return res.sendStatus(404);
    }

    if (req.body.title && req.body.details) {
      const date = new Date();

      const task = new Task({
        title: req.body.title,
        details: req.body.details,
        status: "waiting",
        created_at: date,
        project_id: req.params.project_id
      });

      task.save(function (err, results) {
        if (err)
          return res.sendStatus(500);

        res.send(results);
      });
    }
  });
});

router.get('/task/:task_id/developers/', function(req, res) {
  DeveloperToTask.find({ task_id: req.params.task_id }, function(err, relashion) {
    if (err) return res.sendStatus(500);

    const ids = relashion.map(item => item.developer_id);
    res.send(ids);
  });
});

router.get('/developer/tasks/', function(req, res) {
  DeveloperToTask.find({ developer_id: req.session.user._id }, function(err, relashion) {
    if (err) return res.sendStatus(500);

    const ids = relashion.map(item => item.task_id);
    res.send(ids);
  });
});

router.post('/task/:task_id/developer/:developer_id', developerCheck, function(req, res) {
  const connect = new DeveloperToTask({
    developer_id: req.params.developer_id,
    task_id: req.params.task_id
  });

  connect.save(function (err, results) {
    if (err)
      return res.sendStatus(500);

    res.send(results);
  });
});

router.delete('/task/:task_id/developer/:developer_id', developerCheck, function(req, res) {
  DeveloperToTask.remove({ task_id: req.params.task_id, developer_id: req.params.developer_id}, function(err) {
    if (err) {
      return res.sendStatus(500);
    }

    res.sendStatus(200);
  });
});

router.post('/task/:task_id', function(req, res) {
  if (req.body.status) {
    Task.update({ _id: req.params.task_id }, { $set: { status: req.body.status } }, function(err) {
      if (err) return res.sendStatus(500);

      return res.sendStatus(200);
    });
  } else {
    res.sendStatus(200);
  }
});

module.exports = router;
