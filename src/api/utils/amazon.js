const aws = require('aws-sdk');
const fs = require('fs');
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_REGION = process.env.AWS_S3_REGION;
aws.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY, region: AWS_S3_REGION});
const s3 = new aws.S3();


exports.uploadImage = function(buffer, destFileName, params = {}) {
  return new Promise(function(resolve, reject) {

    s3.upload({
      Bucket: 'spotinapp',
      ACL: 'public-read',
      Body: buffer,
      Key: destFileName.toString(),
      ContentType: 'application/octet-stream',
      ...params
    }, function(err, data) {
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });

};



exports.deleteObject = function(key, params = {}) {
  return new Promise(function(resolve, reject) {
    s3.deleteObject({ Bucket: 'spotinapp', Key: key, ...params}, function (err, data) {
      if (err) reject(err);

      else resolve(data);
    })
  });
};

const emptyDir = async function(dir, listParams = {}, deleteParams = {}) {
  const _listParams = {
    Bucket: "spotinapp",
    Prefix: dir,
    ...listParams

  };

  const listedObjects = await s3.listObjectsV2(_listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const _deleteParams = {
    Bucket: "spotinapp",
    Delete: { Objects: [] },
    ...deleteParams,
  };

  listedObjects.Contents.forEach(({ Key }) => {
    _deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(_deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyDir(dir);
};

exports.getUploadSignedUrl = async function(key, params = {}) {
  return new Promise((resolve, reject) => {
    if (!key && !params.Key) {
      reject("No Bucket Key found");
    }
    const _params = {
      Bucket: "spotinapp",
      Expires: 60,
      ACL: 'public-read',
      Key: key,
      ...params,
    };

    s3.getSignedUrl('putObject', _params, (err, signedURL) => {
      if (err) {
        reject(err);
      };
      resolve(signedURL);
    });
  });
}

exports.emptyDir = emptyDir;
