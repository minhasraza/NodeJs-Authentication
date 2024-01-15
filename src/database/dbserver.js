// const express = require("express")
// const app = express()
// const authroute = require('../routes/authRouter.js');

require("dotenv").config()

// const DB_HOST = process.env.DB_HOST
// const DB_USER = process.env.DB_USER
// const DB_PASSWORD = process.env.DB_PASSWORD
// const DB_DATABASE = process.env.DB_DATABASE
// const DB_PORT = process.env.DB_PORT

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    DB_PORT
} = process.env;

const mysql = require("mysql")

try {
    module.exports = pool = mysql.createPool({
        connectionLimit: 100,
        host: DB_HOST,       //This is your localhost IP
        user: DB_USER,         // "newuser" created in Step 1(e)
        password: DB_PASSWORD,  // password for the new user
        database: DB_DATABASE,      // Database name
        port: DB_PORT             // port name, "3306" by default
    })
    
     pool.getConnection( (err, connection)=>{
        if (err) throw ("error",err);
        console.log ("DB connected successful: " + connection.threadId)
    });   
} catch (error) {
    console.log(error);
}
