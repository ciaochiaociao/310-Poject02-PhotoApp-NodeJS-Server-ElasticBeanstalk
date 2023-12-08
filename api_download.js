//
// app.get('/download/:assetid', async (req, res) => {...});
//
// downloads an asset from S3 bucket and sends it back to the
// client as a base64-encoded string.
//
const dbConnection = require('./database.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

exports.get_download = async (req, res) => {

  console.log("call to /download...");

  try {

    // get bucket_key from assets table
    const sql = `SELECT assetname, userid, bucketkey FROM assets WHERE assetid = ?;`
    dbConnection.query(sql, [req.params.assetid], async (sql_err, results, fields) => {

      try {

        if (sql_err) {
          console.error("error during querying our MySQL server: ", sql_err);
          res.status(400).json({
            "message": sql_err.message,
            "user_id": -1,
            "asset_name": "?",
            "bucket_key": "?",
            "data": []
          });
          return;
        }
        if (results.length == 0) {
          res.status(400).json({
            "message": "no such asset...",
            "user_id": -1,
            "asset_name": "?",
            "bucket_key": "?",
            "data": []
          });
          return;
        }
        console.log(results[0]);
        const { assetname, userid, bucketkey } = results[0];

        console.log(assetname, userid, bucketkey);

        // get object from s3
        const command = new GetObjectCommand({ Bucket: s3_bucket_name, Key: bucketkey })

        // 1st method: await
        try {
          const obj = await s3.send(command);
          const data = await obj.Body.transformToString("base64");
          res.json({
            "message": "success",
            "user_id": userid,
            "asset_name": assetname,
            "bucket_key": bucketkey,
            "data": data,
          });
        } catch (s3_err) {
          res.status(400).json({
            "message": s3_err.message,
            "user_id": -1,
            "asset_name": "?",
            "bucket_key": "?",
            "data": []
          });
        }

      } catch (prog_error) {
        console.error("programming error:", prog_error);
        res.status(400).json({
          "message": prog_error.message,
          "user_id": -1,
          "asset_name": "?",
          "bucket_key": "?",
          "data": []
        });
        return;
      }

    });  // query() ends

    //
    // TODO
    //
    // MySQL in JS:
    //   https://expressjs.com/en/guide/database-integration.html#mysql
    //   https://github.com/mysqljs/mysql
    // AWS:
    //   https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
    //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
    //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
    //


  }//try
  catch (err) {
    //
    // generally we end up here if we made a 
    // programming error, like undefined variable
    // or function:
    //
    res.status(400).json({
      "message": err.message,
      "user_id": -1,
      "asset_name": "?",
      "bucket_key": "?",
      "data": []
    });
  }//catch

}//get