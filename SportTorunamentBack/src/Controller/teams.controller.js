const teamsModel = require("../Models/teams.model");
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
                    teamsModel.countDocuments({},(err,conteo)=>{

                        res.status(200).send({message: "Se integró con exito", team, Equipos: conteo});
                    });

                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        });
    }else{
        res.status(500).send({message:"No puedes ver los equipos"});
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
        teamsModel.countDocuments({},(err,conteo)=>{

            if(conteo >= 1) {
                return res.status(500).send({message: "Error al agregar equipo, Limite de equipos superado en una liga"})
            }
            modelo.save((err, team) => {
                if(err){
                    res.status(500).send({message: "Error en el servidor al integrar un equipo a una liga"});
                }else{
                    if(team){
                        res.status(200).send({message: "Se integró con exito", team, Equipos: conteo});
                    }else{
                        res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                    }
                }
            });
                        
        });
        
    }else{
        res.status(500).send({message:"No puedes agregar los equipos"});
    }
}

function editTeam(req, res){
    var params = req.body;
    var idUsuario = req.params.idUsuario;
    var idTeam =  req.params.idTeam;
    var data = req.user;
    
    var schema = {};
    params.name?schema.name=params.name:null;
    params.image?schema.image=params.image:null;
    
    data.rol == "ADMIN"?schema.league = idLeague:null;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        teamsModel.findByIdAndUpdate(idTeam, schema, {new: true}, (err, edited) =>{
            if(err){
                res.status(500).send({message: "Error en el servidor al editar un equipo"});
            }else{
                if(edited){
                    res.status(200).send({message: "Se editó con exito", edited});
                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        })
    }else{
        res.status(403).send({message: "No puedes editar este equipo"});
    }
}

function deleteTeam(req, res){
    var idUsuario = req.params.idUsuario;
    var idTeam =  req.params.idTeam;
    var data = req.user;
    
    data.rol == "ADMIN"?schema.league = idLeague:null;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        teamsModel.findByIdAndDelete(idTeam,(err, delited) =>{
            if(err){
                res.status(500).send({message: "Error en el servidor al eliminar un equipo"});
            }else{
                if(edited){
                    res.status(200).send({message: "Se elimino con exito", delited});
                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        })
    }else{
        res.status(403).send({message: "No puedes eliminar este equipo"});
    }
}

module.exports = {
    addTeam,
    getTeams,
    editTeam,
    deleteTeam
};