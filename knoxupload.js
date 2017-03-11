'use strict';
var knox = require('knox');
var config = require('./conf/config');

var s3Client = knox.createClient({
    key: config.aws_key
  , secret: config.aws_secret
  , bucket: config.aws_bucket
  , region: config.aws_region
});

module.exports = function (server) {

  // upload file

  // client.putFile(filePath, newFileName, headers, function(err, res) {
  //   if (err) return;
  //   else if (200 == res.statusCode) {
  //     var awsData = res.socket._httpMessage;
  //     console.log('Uploaded to S3: ', awsData.url);
  //   }
  // });

  //setup vars & headers
  var filePath = 'logo.png';
  var folderPath = 'subfolder/' + filePath;
  var headers = {
    'Content-Type': 'application/png',
    'x-amz-acl': 'public-read'
  };

  var req = s3Client.put(filePath, headers);
  req.on('response', function(res){
    console.log('######### Upload #########');
    if (200 == res.statusCode) {
      console.log('saved to %s', req.url);
    }
  });
  req.end();

  s3Client.putFile(filePath, folderPath, headers, function (err, res) {
    console.log('######### Upload to subfolder #########');
    if (err) throw err;
    console.log(res.statusCode);
    console.log(res.headers);
  });

  // get files in bucket
  s3Client.list({}, function (err, data) {
    console.log('######### Get All Files in Bucket #########');
    console.log(err, data);
  });

};