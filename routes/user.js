const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const User = require('../models/User');
const UserTemp = require('../models/UserTemp');

const config = require('../config');
const router = express.Router();

router.post('/register', function(req, res) {
  if (req.body.email && req.body.name && req.body.lastname && req.body.role && req.body.password) {
    const user = new UserTemp({
      email: req.body.email,
      name: req.body.name,
      lastname: req.body.lastname,
      role: req.body.role,
      password: req.body.password
    });

    user.save(function (err, results) {
      if (err)
        return res.sendStatus(500);

      const transporter = nodemailer.createTransport(config.transporterOptions);

      const mailOptions = {
        from: 'task.tracker@gmail.com', // sender address
        to: 'demidovich.daniil@gmail.com', // list of receivers
        subject: 'TaskTracker - Confirm yor password', // Subject line
        html: `<p>To confirm you password click on this link: <a href="http://localhost:8080/register/${results.confirmKey}">Confirm my account</a></p>`// plain text body
      };

      transporter.sendMail(mailOptions, function (err, info) {
         if(err) console.log(err);
      });

      res.send(200);
    });
  }
});

router.get('/register/:confirmKey', function(req, res) {
  UserTemp.findOne({ confirmKey: req.params.confirmKey }, function(err, user) {
    if (err) {
      return res.redirect(500, config.clientServer);
    }

    const newUser = new User({
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      role: user.role,
      password: user.password
    });

    newUser.save(function (err, results) {
      if (err)
        return res.redirect(500, config.clientServer);

      UserTemp.remove({ confirmKey: req.params.confirmKey }, function(err, result){});
      res.redirect(200, config.clientServer);
    });
  });

});

router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) {
      return res.sendStatus(500);
    }
    if (user) {
      bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (result === false) {
            return res.send({ error: "Incorrect password"});
          }

          req.session.user = user;
          res.send(req.session.user);
      });
    } else {
      res.send({ error: "Incorrect user"});
    }
  });
});

router.post('/logout', function(req, res) {
  if (req.session.user) {
    delete req.session.user;
  }

  res.sendStatus(200);
});

router.get('/profile', function(req, res) {
  if (req.session.user) {
    res.send(req.session.user);
  } else {
    res.sendStatus(403);
  }
});

router.get('/users/developers', function(req, res) {
  if (req.session.user && req.session.user.role === "manager") {
    User.find({ role: "developer" }, (err, developers) => {
      if (err) {
        return res.sendStatus(404);
      }

      res.send(developers);
    });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
