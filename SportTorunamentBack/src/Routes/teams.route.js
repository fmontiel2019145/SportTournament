"use strict";

//Imports
var express = require("express");
var leagueController = require('../controller/teams.controller');
var md_authentication = require("../middlewares/authentication");

//Routes
var api = express.Router();
api.get("/user/:idUsuario/league/:idLiga/team", md_authentication.ensureAuth, leagueController.getTeams);
api.post("/user/:idUsuario/league/:idLiga/team", md_authentication.ensureAuth, leagueController.addTeam);
api.put("/user/:idUsuario/league/:idLiga/team/:idTeam", md_authentication.ensureAuth, leagueController.editTeam);
/*
    api.delete("/league/:idUsuario/:idLiga", md_authentication.ensureAuth, leagueController.deleteLeague);
*/

//Exports
module.exports = api;
