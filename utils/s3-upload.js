const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});

export const uploadFile = (data, filename, cb) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Body: data,
    // ContentEncoding: 'base64',
    ContentType: 'image/png',
    ACL: 'public-read'
  };

  s3.upload(params, function(err, data) {  
    cb(err, data);
  });
};