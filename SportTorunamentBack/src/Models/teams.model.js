"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teamsSchema = Schema({
    name: String,
    image : String,
    league : { type: Schema.Types.ObjectId, ref: "leagues" }
});

module.exports = mongoose.model("teams", teamsSchema);
