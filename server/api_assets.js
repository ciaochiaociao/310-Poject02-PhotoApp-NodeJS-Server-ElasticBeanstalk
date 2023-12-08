//
// app.get('/assets', async (req, res) => {...});
//
// Return all the assets from the database:
//
const dbConnection = require('./database.js')

exports.get_assets = async (req, res) => {

  console.log("call to /assets...");

  try {


    dbConnection.query("SELECT * FROM assets ORDER BY assetid ASC", (err, results) => {
      if (err) {
        console.log("error during querying our MySQL server: ", err);
        results.status(400).json({ "message": err.message, "data": [] });
        return;
      }
      res.json({ "message": "success", "data": results });
    })

    //
    // TODO: remember we did an example similar to this in class with
    // movielens database (lecture 05 on Thursday 04-13)
    //
    // MySQL in JS:
    //   https://expressjs.com/en/guide/database-integration.html#mysql
    //   https://github.com/mysqljs/mysql
    //


  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//get
