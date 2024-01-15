const bcrypt = require("bcrypt");
const tokenGenerator = require("../generateAccessToken.js");
const mysql = require("mysql");
const dbconfig = require('../database/dbserver.js');

module.exports = async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  dbconfig.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from usertable where user = ?";
    const search_query = mysql.format(sqlSearch, [name]);

    connection.query(search_query, async (err, result) => {
        connection.release();
        if (err) throw err;
        
        if (result.length == 0) {
            console.log("--------> User does not exist");
            res.json({
                status: false,
                message: "User does not exist",
            });
            // res.sendStatus(404)
        } else {
            const hashedPassword = result[0].password;
            //get the hashedPassword from result
            
            if (await bcrypt.compare(password, hashedPassword)) {
                console.log("---------> Login Successful");
                console.log("---------> Generating accessToken");
                userId = result[0].userId;
          const accessToken = tokenGenerator.generateAccessToken({ user: userId });
          const refreshToken = tokenGenerator.generateRefreshToken({ user: userId });

          res.json({ accessToken: accessToken, refreshToken: refreshToken });
        } else {
          console.log("---------> Password Incorrect");
          res.json({
            status: false,
            message: "Password incorrect!",
          });
        }
      }
    });
  });
};
