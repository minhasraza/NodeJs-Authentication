const bcrypt = require("bcrypt");
const mysql = require("mysql");
const dbconfig = require('../database/dbserver.js');

module.exports = async (req, res) => {
  const user = req.body.name;
  const password = req.body.password;
  const hashPassword = await bcrypt.hash(password, 10);

  if (!user || !password) {
    let validationErrors = {
      status: false,
      messages: [],
    };

    if (!user) {
      validationErrors.messages.push("User name is required");
    }

    if (!password) {
      validationErrors.messages.push("Password is required");
    }

    res.send(validationErrors);
    return;
  }

  try {
    dbconfig.getConnection(async (err, connection) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      };
  
      const sqlSearch = "SELECT * FROM usertable WHERE user = ?";
      const search_query = mysql.format(sqlSearch, [user]);
  
      const sqlInsert =
        "INSERT INTO usertable (userId, user, password) VALUES (0,?,?)";
      const insert_query = mysql.format(sqlInsert, [user, hashPassword]);
      // ? will be replaced by values
      // ?? will be replaced by string
  
      connection.query(search_query, async (err, result) => {
        if (err) throw err;
        console.log("------> Search Results");
        console.log(result.length);
        if (result.length != 0) {
          connection.release();
          console.log("------> User already exists");
          res.send({
            status: false,
            message: user + " Already exsists",
          });
          //   res.sendStatus(409);
        } else {
          connection.query(insert_query, (err, result) => {
            connection.release();
            if (err) throw err;
            console.log("--------> Created new User");
            console.log(result.insertId);
            res.send({
              status: true,
              message: "User registered successfully"
            });
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
  }

};
