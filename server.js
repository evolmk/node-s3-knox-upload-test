'use strict';

var express = require('express');
var path = require('path');

// get vars from .env file
var dotenv = require('dotenv');
dotenv.load();

// get config
var config = require('./conf/config');

// Create the server
var app = express();

// Setup Jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Serve Static Files
app.use(express.static(path.join(__dirname, 'client')));  //app
app.use(express.static(path.join(__dirname, 'views'))); //views
app.use(express.static(path.join(__dirname, 'bower_components'))); //bower

//Upload Module
var knox = require('knox');
var config = require('./conf/config');
var fs = require('fs');
var mime = require('mime');

//create knox s3 client
var s3Client = knox.createClient({
  key: config.aws_key
  , secret: config.aws_secret
  , bucket: config.aws_bucket
  , region: config.aws_region
});



exports.upload = function uploadS3(req, res, next) {
  var file = req.files.file;
  var stream = fs.createReadStream(file.path);
  var mimetype = mime.lookup(file.path);
  //var req;

  if (mimetype.localeCompare('image/jpeg')
    || mimetype.localeCompare('image/pjpeg')
    || mimetype.localeCompare('image/png')
    || mimetype.localeCompare('image/gif')) {

    req = knox.putStream(stream, file.name,
      {
        'Content-Type': mimetype,
        'Cache-Control': 'max-age=604800',
        'x-amz-acl': 'public-read',
        'Content-Length': file.size
      },
      function (err, result) {
        console.log(result);
      }
    );
  } else {
    next(new HttpError(HTTPStatus.BAD_REQUEST))
  }

  req.on('response', function (res) {
    if (res.statusCode == HTTPStatus.OK) {
      res.json('url: ' + req.url)
    } else {
      next(new HttpError(res.statusCode))
    }
  });

};



exports.uploadTest = function uploadS3Test(req, res, next) {

  //setup vars & headers

  var filePath = 'logo-large.png';
  var destPath = 'subfolder/' + filePath;
  var mimetype = mime.lookup(filePath); //filePath.path for upload
  var headers = {
    'Content-Type': mimetype,
    //'Content-Length': [LENGTH-HERE],
    'x-amz-acl': 'public-read'
  };

  console.log(mimetype);



  // upload file (from path)

  var progressUploadFile = false;

  var file = s3Client.putFile(filePath, destPath, headers, function (err, res) {
    if (err) {
      console.log('Error in File Upload:');
      console.log(err);
    };
    if (200 == res.statusCode) {
      console.log('File saved to %s', destPath);
    }
    console.log('File progress fired:' + progressUploadFile);
  });

  file.on('progress', function (e) {
    progressUploadFile = true;
    console.log('File Percent:' + e.percent);
    console.log('File Total:' + e.total);
    console.log('File written:' + e.written);
  });


  // upload file (from stream)

  var progressUploadStream = false;

  var fileStream = fs.createReadStream(filePath);
  s3Client.putStream(fileStream, destPath, headers, function (err, res) {
    if (err) {
      console.log('Error in Stream Upload:');
      console.log(err);
    }
    if (200 == res.statusCode) {
      console.log('Stream saved to %s', destPath);
    }
    console.log('Stream progress fired:' + progressUploadStream);
  });

  // uploadStream.on('progress', function (e) {
  //   progressUploadStream = true;
  //   console.log('Stream Percent:' + e.percent);
  //   console.log('Stream Total:' + e.total);
  //   console.log('Stream written:' + e.written);
  // });

  // get files in bucket
  // s3Client.list({}, function (err, data) {
  //   console.log('######### Get All Files in Bucket #########');
  //   console.log(err, data);
  // });


};



// Routes
// index
app.get('/', function(req, res){
  res.render('home', {
    title: 'Home',
    description: 'Homepage Description'
  });
});

// home
app.get('/home', function(req, res) {
  res.render('home', {
    title: 'Home',
    description: 'Homepage Description'
  });
});

// Handles refresh or direct link to a angular route
// Handles refresh or direct link to a angular route
app.get('*', function(req, res) {
  console.log('**not found**: ' + req.url + ' ['+req.method + ']');
  res.render('error', {
    pageTitle: 'Error',
    pageError: req.url + ' ['+req.method + '] not found'
  });
});

//add listen port
if (!module.parent) {
  app.listen(config.serverPort, function () {
    console.log('%s listening at %s', config.name, config.serverPort);
  });
}

module.exports = app;