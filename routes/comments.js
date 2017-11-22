var express = require('express');
var router = express.Router();

const Comment = require('../models/Comment');

// middleware for check auth
router.use(function(req, res, next) {
  if(!req.session.user) {
    return res.sendStatus(403);
  } else {
    next();
  }
});

router.get('/comments/:task_id', function(req, res) {
  Comment.find({ task_id: req.params.task_id }, function(err, tasks) {
    if (err) {
      return res.sendStatus(500);
    }

    res.send(tasks);
  });
});

router.post('/comments/:task_id', function(req, res) {
  if (!req.body.message || req.body.message.length === 0) {
    return res.sendStatus(500);
  }

  const date = new Date();
  const comment = new Comment({
    task_id: req.params.task_id,
    message: req.body.message,
    created_at: date,
    author_id: req.session.user._id,
    author: `${req.session.user.lastname} ${req.session.user.name} (${req.session.user.role})`
  });

  comment.save(function (err, results) {
    if (err) {
      return res.sendStatus(500);
    }

    res.sendStatus(200);
  });
});

router.put('/comments/:comment_id', function(req, res) {
  Comment.update({ _id: req.params.comment_id }, { $set: { message: req.body.message }}, function(err, data) {
    if (err) {
      return res.sendStatus(501);
    }console.log(data);
    res.sendStatus(200);
  });
});

router.delete('/comments/:comment_id', function(req, res) {
  Comment.findOne({ _id: req.params.comment_id }, function(err, comment) {
    if (comment.author_id != req.session.user._id) {
      return res.sendStatus(403);
    }

    Comment.remove({ _id: req.params.comment_id }, function(err, data) {
      if (err) {
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });
});

module.exports = router;
