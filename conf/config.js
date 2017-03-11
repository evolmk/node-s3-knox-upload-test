
exports.name = 'node-s3upload';
exports.serverPort = 9000;

// aws config - grab ENV vars
exports.aws_key = process.env.AWS_ACCESS_KEY_ID;
exports.aws_secret = process.env.AWS_SECRET_ACCESS_KEY;
exports.aws_bucket = process.env.S3_BUCKET;
exports.aws_region = process.env.AWS_REGION; //not necessary if using US Standard region