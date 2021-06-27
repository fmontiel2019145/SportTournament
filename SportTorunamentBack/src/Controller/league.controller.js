"use strict";
const leagueModel = require('../Models/league.model');
var LeagueModel = require('../Models/league.model');

function getLeagues(req, res){
    var idUsuario = req.user.sub;
    var data = req.user;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        LeagueModel.find({userCreator : idUsuario}, (err, ligas) => {
            if(err){
                res.status(500).send({message: "Error en el servidor al obtener las ligas"});
            }else{
                if(ligas && ligas.length > 0){
                    res.status(200).send(ligas);
                }else{
                    res.status(404).send({message: "No hay ligas"});
                }
            }
        });
    }else{
        res.status(403).send({message: "No ver ligas"});
    }
}

function addLeague(req, res){
    var params =  req.body;
    var idUsuario = req.user.sub;
    var data = req.user;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        var insertModel = new LeagueModel({
            name: params.name,
            userCreator: idUsuario
        });
        insertModel.save((err, league) => {
            if(err){
                res.status(500).send({message: "Error en el servidor al integrar una liga a un usuario"});
            }else{
                if(league){
                    res.status(200).send({message: "Se integró con exito", league});
                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        });
    }else{
        console.log(idUsuario)
        res.status(403).send({message: "No puedes agregar una liga"});
    }
}

function editLeague(req, res){
    var params =  req.body;
    var idLiga = req.params.idLiga;
    var idUsuario = req.params.idUsuario;
    var data = req.user;

    var schema = {};
    params.name?schema.name=params.name:null;
    
    data.rol == "ADMIN"?schema.userCreator = idUsuario:null;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        LeagueModel.findByIdAndUpdate(idLiga, schema, {new: true}, (err, edited) => {
            if(err){
                res.status(500).send({message: "Error en el servidor al editar una liga"});
            }else{
                if(edited){
                    res.status(200).send({message: "Se editó con exito", edited});
                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        });
    }else{
        res.status(403).send({message: "No puedes editar esta liga"});
    }
}

function deleteLeague(req, res){
    var idLiga = req.params.idLiga;
    var idUsuario = req.params.idUsuario;
    var data = req.user;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        LeagueModel.findByIdAndDelete(idLiga, (err, deleted) => {
            if(err){
                res.status(500).send({message: "Error en el servidor al eliminar una liga"});
            }else{
                if(deleted){
                    res.status(200).send({message: "Se eliminó con exito", deleted});
                }else{
                    res.status(404).send({message: "No se encontró la liga que quieres eliminar"});
                }
            }
        });
    }else{
        res.status(403).send({message: "No puedes editar esta liga"});
    }
}

module.exports = {
    getLeagues,
    addLeague,
    editLeague,
    deleteLeague
};
