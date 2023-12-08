//
// app.put('/user', async (req, res) => {...});
//
// Inserts a new user into the database, or if the
// user already exists (based on email) then the
// user's data is updated (name and bucket folder).
// Returns the user's userid in the database.
//
const dbConnection = require('./database.js');
const mysql = require('mysql');
const { v4: uuid4 } = require('uuid');
const util = require('util');

exports.put_user = async (req, res) => {

  console.log("call to /user...");

  try {

    var data = req.body;  // data => JS object

    console.log(data);

    // data = {
    // "email": "...",
    // "lastname": "...",
    // "firstname": "...",
    // "bucketfolder": "..."
    // }

    // 
    sql = `SELECT userid FROM users WHERE email = ?;`

    try {
      console.log("Querying ...");
      dbConnection.query(sql, [data["email"]], (err, ...) =>{});
      // promisify mysql.Connection.query() manually
      pDB = new Promise((resolve, reject) => {
        dbConnection.query(sql, [data["email"]], (err, results, fields) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          resolve(results);
        });
      });

      const results = await pDB;
      if (results.length == 0) {
        // create a new user
        console.log("Creating a user from email: " + data["email"]);
        const sql = `INSERT INTO users (email, lastname, firstname, bucketfolder) VALUES (?, ?, ?, ?)`;
        const bucketfolder = data["bucketfolder"];
        // const bucketfolder = uuid4();

        // promisify dbConnection.query() and bind the object instance to "this" keyword in the function to make it work
        const query_func = util.promisify(dbConnection.query).bind(dbConnection);

        const result = await query_func(sql, [data["email"], data["lastname"], data["firstname"], bucketfolder]);
        if (result.affectedRows != 1) {
          console.log("Warning! # of rows affected is not 1, but ", result);
        }
        res.json({
          "message": "inserted",
          "userid": result.insertId
        });
      } else {
        // update an existing user
        console.log("Updating a user from email: " + data["email"]);
        const userdata = results[0];
        // console.log(results);
        const userid = userdata.userid;
        const sql = `UPDATE users SET ? WHERE userid = ?`;
        const query = mysql.format(sql, [data, userid]);
        console.info("Updating an existing user: ", userid);
        const result = await dbConnection.query(query);
        console.info("Finished updating");

        res.json({
          "message": "updated",
          "userid": userid
        });
      }
    } catch (sql_err) {
      console.log("Something went wrong");

      console.log("SQL Error: ", sql_err.message);
      res.status(400).json({
        "message": "some sort of error message",
        "userid": -1
      });
    }


  }//try
  catch (err) {
    console.log("**ERROR:", err.message);

    res.status(400).json({
      "message": err.message,
      "userid": -1
    });
  }//catch

}//put


console.log('''...)