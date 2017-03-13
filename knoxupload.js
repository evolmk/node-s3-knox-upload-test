'use strict';
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


module.exports = function (server) {



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
  var uploadStream = s3Client.putStream(fileStream, destPath, headers, function (err, res) {
    if (err) {
      console.log('Error in Stream Upload:');
      console.log(err);
    }
    if (200 == res.statusCode) {
      console.log('Stream saved to %s', destPath);
    }
    console.log('Stream progress fired:' + progressUploadStream);
  });

  uploadStream.on('progress', function (e) {
    progressUploadStream = true;
    console.log('Stream Percent:' + e.percent);
    console.log('Stream Total:' + e.total);
    console.log('Stream written:' + e.written);
  });



  // get files in bucket
  // s3Client.list({}, function (err, data) {
  //   console.log('######### Get All Files in Bucket #########');
  //   console.log(err, data);
  // });



};