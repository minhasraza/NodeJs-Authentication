const token = require("../generateAccessToken.js");
const jwt = require("jsonwebtoken");
const dbconfig = require("../database/dbserver.js");
const mysql = require("mysql");
module.exports = (req, res) => {
  let userId;
  let requestedToken;
  if (req.body.token) {
    requestedToken = req.body.token;

    jwt.verify(requestedToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(403).send({ status: false, message: "Invalid Refresh Token" });
        return;
      } else {
        userId = user && user.user;        
    }
    });
  } else {
    res.send({
      status: false,
      message: "Refresh Token is required",
    });
    return;
  }

  dbconfig.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
    const sqlSearch = "SELECT * FROM usertable WHERE userId = ?";
    const search_query = mysql.format(sqlSearch, [userId]);

    connection.query(search_query, (err, result) => {
      if (err) throw err;

      if (result.length > 0 && requestedToken == result[0].refresh_token) {
        const accessToken = token.generateAccessToken({ user: userId });
        const refreshToken = token.generateRefreshToken({ user: userId });

        // console.log(accessToken, refreshToken);
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        res.json({ status: false, message: "Refresh Token is invalid" });
      }
    });
  });
};
