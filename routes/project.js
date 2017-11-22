var express = require('express');
var router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');

// middleware for auth check
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

router.get('/projects', function(req, res) {
    if (req.session.user.role === "manager") {
      Project.find({ manager_id: req.session.user._id }, (err, projects) => {
        if (err) return res.sendStatus(500);

        res.send(projects);
      });
    }

    if (req.session.user.role === "developer") {
      Project.find({ developer_ids: req.session.user._id }, (err, projects) => {
        if (err) return res.sendStatus(500);

        res.send(projects);
      });
    }
});

router.post('/projects', developerCheck, function(req, res) {
  if (req.body.name && req.body.description) {
    const date = new Date();

    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      created_at: date,
      manager_id: req.session.user._id
    });

    project.save(function (err, results) {
      if (err)
        return res.sendStatus(500);

      res.sendStatus(200);
    });
  }
});

router.delete('/projects/:id', developerCheck, function(req, res) {
  Project.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return res.sendStatus(500);
    }

    res.sendStatus(200);
  });
});

router.get('/projects/:project_id/developers', function(req, res) {
  Project.findById(req.params.project_id, function(err, project) {
    if (err) return res.sendStatus(500);

    User.find({ _id: { $in: project.developer_ids }}, (err, developers) => {
      res.send(developers);
    });
  });
});

router.post('/projects/:project_id/developers', developerCheck, function(req, res) {
  Project.findById(req.params.project_id, function(err, project) {
    if (err) return req.sendStatus(500);
    const developersIds = project.developer_ids;
    developersIds.push(req.body.developer_id);

    Project.update({ _id: req.params.project_id }, { $set: { developer_ids: developersIds }}, function(err) {
      if (err) {
        return res.sendStatus(500);
      }

      res.sendStatus(200);
    });
  });
});

router.delete('/projects/:project_id/developers/:developer_id', developerCheck, function(req, res) {
  Project.findById(req.params.project_id, function(err, project) {
    if (err) return req.sendStatus(500);

    const developersIds = project.developer_ids;
    const developerIndex = developersIds.indexOf(req.params.developer_id);
    developersIds.splice(developerIndex, 1);

    Project.update({ _id: req.params.project_id }, { $set: { developer_ids: developersIds }}, function(err) {
      if (err) {
        return res.sendStatus(500);
      }

      res.sendStatus(200);
    });
  });
});

module.exports = router;
