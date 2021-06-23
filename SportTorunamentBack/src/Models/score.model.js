"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var scoreSchema = Schema({
  name: String,
  teamOne:{ type: Schema.Types.ObjectId, ref: "teams" },
  pointsOne: Number,
  teamTwo:{ type: Schema.Types.ObjectId, ref: "teams" },
  pointsTwo: Number
});

module.exports = mongoose.model("scores", scoreSchema);
