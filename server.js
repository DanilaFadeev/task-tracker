const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);

const config = require('./config');

// Routes
const users = require('./routes/user');
const projects = require('./routes/project');
const tasks = require('./routes/task');
const comments = require('./routes/comments');

const app = express();
app.use(cors({ credentials: true, origin: config.clientServer }));

mongoose.Promise = global.Promise;
mongoose.connect(config.database);
const db = mongoose.connection;

app.use(cookieParser());
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.send('Welcome to API!');
});

app.use(users);
app.use(projects);
app.use(tasks);
app.use(comments);

app.listen(config.serverPort, function() {
  console.log("Server is running on port 8080");
});
