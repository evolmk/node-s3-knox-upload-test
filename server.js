'use strict';

var express = require('express');

// get vars from .env file
var dotenv = require('dotenv');
dotenv.load();

// get config
var config = require('./conf/config');

// Create the server
var server = express();

// Reguire knoxupload.js
require('./knoxupload')(server);

//add listen port
if (!module.parent) {
  server.listen(config.serverPort, function () {
    console.log('%s listening at %s', config.name, config.serverPort);
  });
}

module.exports = server;