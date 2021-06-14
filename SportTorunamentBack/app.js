"use strict";

//Variables Globals
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
//Import

//Middlewares
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

//Route Application localhost:3000/api/

//Exports
module.exports = app;
