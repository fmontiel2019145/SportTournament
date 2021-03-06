"use strict";
/*const { response } = require('express');
const leagueModel = require('../Models/league.model');*/
//Imports
var LeagueModel = require('../Models/league.model');

//Functions

//List league
function getLeagues(req, res){
    var idUsuario = req.params.sub;
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


//ADD league
function addLeague(req, res){
    try{
    var params =  req.body;
    var idUsuario = req.user.sub;
    var data = req.user;
    var liganame = params.name;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && createUser == data.sub)){
        LeagueModel.findOne({ userCreator : idUsuario,name: liganame}, (err, liga) => {
                if(err){
                    throw "Error en el servidor al obtener las ligas";
                }
       
                if(liga!=null && liga.name == liganame){
                res.status(200).send({message: "error ya existe una liga con este nombre", liga});   
                }else{
                    var insertModel = new LeagueModel({
                        name: params.name,
                        userCreator: idUsuario
                    });
                    insertModel.save((err, league) => {
                        if(err){
                            res.status(500).send({message: "Error en el servidor al integrar una liga a un usuario"});
                        }else{
                            if(league){
                                res.status(200).send({message: "Se integr?? con exito", league});
                            }else{
                                res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                            }
                        }
                    });
                }   
        });
    }
    return res;
}catch(error)
 {
    return error;
}

}

//Edit league
function editLeague(req, res){
    var params =  req.body;
    var idLiga = req.params.idLiga;
    var idUsuario = req.params.idUsuario;
    var data = req.user;

    var schema = {};
    params.name?schema.name=params.name:null;
    
    data.rol == "ADMIN"?schema.userCreator = idUsuario:null;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && createUser == data.sub)){
        LeagueModel.findByIdAndUpdate(idLiga, schema, {new: true}, (err, edited) => {
            if(err){
                res.status(500).send({message: "Error en el servidor al editar una liga"});
            }else{
                if(edited){
                    res.status(200).send({message: "Se edit?? con exito", edited});
                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        });
    }else{
        res.status(403).send({message: "No puedes editar esta liga"});
    }
}

//Delete league
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
                    res.status(200).send({message: "Se elimin?? con exito", deleted});
                }else{
                    res.status(404).send({message: "No se encontr?? la liga que quieres eliminar"});
                }
            }
        });
    }else{
        res.status(403).send({message: "No puedes eliminar esta liga"});
    }
}

module.exports = {
    getLeagues,
    addLeague,
    editLeague,
    deleteLeague
};
