const aws = require('aws-sdk');
const fs = require('fs');
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

console.log("aaaassss", AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);
aws.config.region = 'eu-west-1';
aws.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});
const s3 = new aws.S3();


exports.uploadImage = function(file, destFileName) {
    return new Promise(function(resolve, reject) {
      s3.upload({
        Bucket: 'spotinapp',
        ACL: 'public-read',
        Body: file.buffer,
        Key: destFileName.toString(),
        ContentType: 'application/octet-stream'
      }, function(err, data) {
        console.log("eeeeee", err, data);
      });
    });

}
