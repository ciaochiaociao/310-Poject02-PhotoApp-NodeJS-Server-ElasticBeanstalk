// const AWS = require('aws-sdk');

const { GetObjectCommand } = require('@aws-sdk/client-s3');

const { s3, s3_bucket_name } = require('./aws.js');
const config = require('./config.js');
process.env.AWS_SHARED_CREDENTIALS_FILE = config.photoapp_config;

// Set your AWS credentials
// AWS.config.update({
//   accessKeyId: 'AKIA4MWGUNLZBQD3EC76',
//   secretAccessKey: 'qAZ7GTLW/8p9dXBxGIq3aExy/8PpNZBgptczea1u',
//   // Optionally, specify the AWS region (e.g., 'us-east-1')
//   region: 'us-east-2',
// });

// Create an S3 client
// const s3 = new AWS.S3();

// Specify the S3 operation (e.g., getObject)
const params = {
  Bucket: s3_bucket_name,
  Key: '0b7dc4b4-e0a0-4124-bbfa-f0b1079ccb26/14505c8d-a095-4900-9ab4-9dbeca15cb62.jpg',
};

// Perform the S3 operation
command = new GetObjectCommand(params);
const obj = s3.send(command, get_obj);

async function get_obj(err, res) {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log(await res.Body.transformToString('base64'));
}