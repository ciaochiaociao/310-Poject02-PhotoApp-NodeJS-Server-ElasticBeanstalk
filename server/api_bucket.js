//
// app.get('/bucket?startafter=bucketkey', async (req, res) => {...});
//
// Retrieves the contents of the S3 bucket and returns the 
// information about each asset to the client. Note that it
// returns 12 at a time, use startafter query parameter to pass
// the last bucketkey and get the next set of 12, and so on.
//
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

exports.get_bucket = async (req, res) => {

  console.log("call to /bucket...");

  //
  // TODO: remember, 12 at a time...  Do not try to cache them here, instead 
  // request them 12 at a time from S3
  //
  // AWS:
  //   https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
  //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/listobjectsv2command.html
  //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
  //
  
  try {

    const input = { // ListObjectsV2Request
      Bucket: s3_bucket_name,
      MaxKeys: 12,
      StartAfter: req.query.startafter,
    };
    const command = new ListObjectsV2Command(input);
    try {
      const response = await s3.send(command);
      console.log('# of objects:', response.KeyCount);
      if (!("Contents" in response)) {
        res.json({"message": "success", "data": []});
        return;
      }
      res.json({"message": "success", "data": response.Contents});
      return;
    }
    catch (s3_err) {
      console.log("error during s3.send: ", s3_err);
      res.status(400).json({"message": s3_err.message, "data": []});
      return;
    }
  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
    return;
  }//catch

}//get
