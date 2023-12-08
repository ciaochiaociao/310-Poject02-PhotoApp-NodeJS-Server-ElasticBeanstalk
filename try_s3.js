const { GetObjectCommand, ListBucketsCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const {s3, s3_bucket_name, s3_region_name} = require("./aws.js");

// const command_dict = {
//   Bucket: s3_bucket_name,
//   Key: "0b7dc4b4-e0a0-4124-bbfa-f0b1079ccb26/3a5c117d-3dd3-41a3-aa15-75a895a922a7.jpg"
// }

// const get_command = new GetObjectCommand(command_dict);

// const list_command = new ListBucketsCommand({});  // failed

console.log(s3_bucket_name);
// const command_dict = {
//   Bucket: s3_bucket_name
// }
// const list_obj_command = new ListObjectsV2Command(command_dict);

async function test(req, res) {
  // let results = await s3.send(list_command);
  // console.log(results.Body);
  // results = await s3.send(get_command);
  // console.log(results.Body);
  results = await s3.send(list_obj_command);
  // console.log(results.Body);

}

module.exports = {test: test};