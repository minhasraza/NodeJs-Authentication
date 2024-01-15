const jwt = require("jsonwebtoken");
const dbconfig = require("../database/dbserver.js");
const mysql = require("mysql");
module.exports = (req, res) => {
  let username;
  const requestedToken = req.body.token;
  if (requestedToken) {
    const decodedToken = jwt.decode(requestedToken);
    // Extracting the username from the decoded token
    username = decodedToken && decodedToken.user;
  } else {
    res.send({
      status: false,
      message: "Token is required",
    });
    return;
  }

  dbconfig.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
    const sqlSearch = "SELECT * FROM usertable WHERE user = ?";
    const search_query = mysql.format(sqlSearch, [username]);

    connection.query(search_query, (err, result) => {
      if (err) throw err;

      if (result.length > 0 && requestedToken === result[0].refresh_token) {
        const sqlUpdate = "UPDATE usertable SET refresh_token = NULL where user = ?";
        const update_query = mysql.format(sqlUpdate, [username]);
        
        connection.query(update_query, (err, result) => {
            if (err) throw (err);

            console.log(result.affectedRows);
            if (result.affectedRows > 0) {
                res.status(204).send("Logged out!");
            } else{
                console.log(`--------> No user found with the specified token and username`);
                res.status(404).json({ message: 'User not found or token mismatch' });
            }
        })
      } else {
        res.json({ status: false, message: 'Refresh Token is invalid' });
    }
    });
  });
};