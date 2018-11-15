const aws = require('aws-sdk');
const fs = require('fs');
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

aws.config.region = 'eu-west-1';
aws.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});
const s3 = new aws.S3();


exports.uploadImage = function(buffer, destFileName) {
  return new Promise(function(resolve, reject) {
    s3.upload({
      Bucket: 'spotinapp',
      ACL: 'public-read',
      Body: buffer,
      Key: destFileName.toString(),
      ContentType: 'application/octet-stream'
    }, function(err, data) {
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });

};

exports.deleteObject = function(key) {
  return new Promise(function(resolve, reject) {
    s3.deleteObject({ Bucket: 'spotinapp', Key: key}, function (err, data) {
      if (err) reject(err);

      else resolve(data);
    })
  });
};

const emptyDir = async function(dir) {
  const listParams = {
    Bucket: "spotinapp",
    Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: "spotinapp",
    Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyDir(dir);
};

exports.emptyDir = emptyDir;
