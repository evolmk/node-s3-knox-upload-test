'use strict';
var knox = require('knox');
var MultiPartUpload= require('knox-mpu');

var config = require('./conf/config');
var fs = require('fs');
var http = require('http');

var s3Client = knox.createClient({
    key: config.aws_key
  , secret: config.aws_secret
  , bucket: config.aws_bucket
  , region: config.aws_region
});

module.exports = function (server) {

  //setup vars & headers

  var filePath = 'logo-large.png';
  var stream = fs.createReadStream(filePath);

  var headers = {
    'Content-Type': 'application/png',
    'x-amz-acl': 'public-read'
  };
  // var headers = {
  //   'Content-Length': res.headers['content-length'],
  //   'Content-Type': res.headers['content-type']
  // };

  // upload file from path
  http.get({ host: 'google.com', path: '/' }, function (res) {
    var headers = {
        'Content-Length': res.headers['content-length']
      , 'Content-Type': res.headers['content-type']
      , 'x-amz-acl': 'public-read'
    };

    var progressHappened = false;

    var req = s3Client.putStream(res, '/google', headers, function (err, res) {
      if (200 == res.statusCode) {
        console.log('file saved to: %s', req.url);
      }
      console.log(progressHappened);
    });

    req.on('progress', function (e) {
      progressHappened = true;
      console.log(e);
      console.log(e.percent + '/' + e.total + ' | ' + e.written);
    });
  });



  // upload file from path, and set destPath (subfolder)
  var destPath = 'subfolder/' + filePath;
  s3Client.putFile(filePath, destPath, headers, function (err, res) {
    console.log('\n######### Upload to subfolder #########\n');
    if (err) throw err;
    if (200 == res.statusCode) {
      console.log(filePath + ' saved to %s', destPath);
    }
    console.log('\nheaders:');
    console.log(res.headers);
  });

  // get files in bucket
  s3Client.list({}, function (err, data) {
    console.log('\n######### Get All Files in Bucket #########\n');
    console.log(err, data);
  });

};