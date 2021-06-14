"use strict";

//Imports
var express = require("express");
var userController = require("../controller/user.controller");
var md_authentication = require("../middlewares/authentication");

//Routes
var api = express.Router();
api.post("/saveUser", userController.saveUser);
api.post("/login", userController.login);

//Exports
module.exports = api;
