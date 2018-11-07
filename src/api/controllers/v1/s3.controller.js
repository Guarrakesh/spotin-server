const APIError = require('../../utils/APIError');


const aws = require('aws-sdk');

const S3_BUCKET = process.env.S3_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;


exports.signUrl = (req, res, next) => {

  aws.config.region = 'eu-west-1';
  aws.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});
  const s3 = new aws.S3();


  try {
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
      ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {

        return err;
      }


      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      return returnData;
    });

  } catch (error) {
    next(error);
  }
};
