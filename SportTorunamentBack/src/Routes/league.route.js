"use strict";

//Imports
var express = require("express");
var leagueController = require('../controller/league.controller');
var md_authentication = require("../middlewares/authentication");

//Routes
var api = express.Router();
api.get("/leagues/:idUsuario", md_authentication.ensureAuth, leagueController.getLeagues);
api.post("/league/:idUsuario", md_authentication.ensureAuth, leagueController.addLeague);
api.put("/league/:idUsuario/:idLiga", md_authentication.ensureAuth, leagueController.editLeague);
api.delete("/league/:idUsuario/:idLiga", md_authentication.ensureAuth, leagueController.deleteLeague);

//Exports
module.exports = api;
