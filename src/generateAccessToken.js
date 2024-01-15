const jwt = require("jsonwebtoken");
const dbconfig = require("./database/dbserver.js");
const mysql = require("mysql");

// accessTokens
function generateAccessToken(userId) {
  return jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

// const expires_at = "0000-00-00 00:20:00";
function generateRefreshToken(id, res) {
    const userId = id.user;
    console.log("userId", userId);

  const refreshToken = jwt.sign({ user: userId }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"});

  dbconfig.getConnection(async (err, connection) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    const sqlSearch = "SELECT * FROM usertable WHERE userId = ?";
    const search_query = mysql.format(sqlSearch, [userId]);

    connection.query(search_query, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        const userId = result[0].userId;

        const sqlUpdate =
          "UPDATE usertable SET refresh_token = ? WHERE userId = ?";
        const update_query = mysql.format(sqlUpdate, [refreshToken, userId]);

        connection.query(update_query, (err) => {
          connection.release();
          if (err) throw err;

          console.log(`--------> Updated refresh token for user ${userId}`);
        });
      }
    });
  });
  return refreshToken;
}
module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
