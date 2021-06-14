"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = Schema({
  name: String,
  email: String,
  user: String,
  password: String,
  rol: { type: String, default: "CLIENTE" },
});

module.exports = mongoose.model("users", userSchema);
