const { Router } = require('express');
const app = Router();
const register = require("../controller/authController.js");
const login = require("../controller/loginController.js");
const refresh = require('../controller/refreshController.js');
const logout = require('../controller/logoutController.js');

app.post("/createUser", register);

app.post("/login", login);

app.post("/refreshToken", refresh);

app.delete("/logout", logout);

module.exports = app;