const TeamsModel = require("../Models/teams.model");

function getTeams(req, res){
    var idUsuario = req.params.idUsuario;
    var idLiga =  req.params.idLiga;
    var data = req.user;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        TeamsModel.find({league: idLiga}, (err, team) => {
            if(err){
                res.status(500).send({message: "Error en el servidor al integrar un equipo a una liga"});
            }else{
                if(team){
                    res.status(200).send({message: "Se integró con exito", team});
                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        });
    }
}

function addTeam(req, res){
    var params = req.body;
    var idUsuario = req.params.idUsuario;
    var idLiga =  req.params.idLiga;
    var data = req.user;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        var modelo = new TeamsModel({
            name : params.name,
            image : params.image,
            league : idLiga
        });

        modelo.save((err, team) => {
            if(err){
                res.status(500).send({message: "Error en el servidor al integrar un equipo a una liga"});
            }else{
                if(team){
                    res.status(200).send({message: "Se integró con exito", team});
                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        });
    }
}

function editTeam(req, res){

}

module.exports = {
    addTeam,
    getTeams,
    editTeam
};