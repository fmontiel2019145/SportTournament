"use strict";

//Imports
var express = require("express");
var leagueController = require('../controller/teams.controller');
var md_authentication = require("../middlewares/authentication");

//Routes
var api = express.Router();
//api.get("/teams/:idUsuario", md_authentication.ensureAuth, leagueController.getLeagues);
api.post("/teams/:idUsuario/:idLiga", md_authentication.ensureAuth, leagueController.addTeam);
/*
    api.put("/league/:idUsuario/:idLiga", md_authentication.ensureAuth, leagueController.editLeague);
    api.delete("/league/:idUsuario/:idLiga", md_authentication.ensureAuth, leagueController.deleteLeague);
*/

//Exports
module.exports = api;
