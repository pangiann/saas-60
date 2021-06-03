const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const addQARouter = require('./routes/add_q&a_service');
const showQARouter = require('./routes/show_q&a_service');
const usersMinorRouter = require('./routes/login_register_service');
const usersProfileRouter = require('./routes/users_profile_service');
const totalAnalyticsRouter = require('./routes/total_analytics_service');
const app = express();
const cors = require('cors')
app.use(cors())



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/showQA', showQARouter)
app.use('/addQA', addQARouter);
app.use('/loginRegister', usersMinorRouter);
app.use('/usersProfile', usersProfileRouter);
//app.use('/totalAnalytics', totalAnalyticsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// log errors
app.use(function(err, req, res, next){
  const status = err.status || 500;
  if (status >= 500 || req.app.get('env') === 'development') {
    console.error(err.stack);
  }
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  res.status(status);
  const message = status >= 500 ? "Something's wrong" : err.message;
  const expose = status >= 500 && req.app.get('env') === 'development';
  res.end(expose ? message + '\n\n' + err.stack : message);
});

module.exports = app;
