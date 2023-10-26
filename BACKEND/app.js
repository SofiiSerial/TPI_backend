var createError = require('http-errors');
var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./routes/api/main');


var app = express();

app.use(bodyParser.json());

app.use('/api', apiRouter);

module.exports = app;
