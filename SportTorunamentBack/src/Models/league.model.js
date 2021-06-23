"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var leagueSchema = Schema({
  name: String,
  userCreator:{ type: Schema.Types.ObjectId, ref: "users" },
});

module.exports = mongoose.model("leagues", leagueSchema);
