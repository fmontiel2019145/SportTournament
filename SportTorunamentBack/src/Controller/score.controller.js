const scoreModel = require("../Models/score.model");
const ScoreModel = require("../Models/score.model");

function getScore(req, res){
    var idUsuario = req.params.idUsuario;
    var idScore =  req.params.idScore;
    var data = req.user;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        ScoreModel.find({score: idScore}, (err, score) => {
            if(err){
                res.status(500).send({message: "Error en el servidor al ver un score"});
            }else{
                if(score){

                        res.status(200).send({message: "Se integró con exito", score});

                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        });
    }else{
        res.status(500).send({message:"No puedes ver los scores"});
    }
}


function addScore(req, res){
    var params = req.body;
    var idUsuario = req.params.idUsuario;
    var data = req.user;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        var modelo = new scoreModel({
            name: params.name,
            teamOne: params.teamOne,
            pointsOne: params.pointsOne,
            teamTwo: params.teamTwo,
            pointsTwo: params.pointsTwo
        });
            modelo.save((err, score) => {
                if(err){
                    res.status(500).send({message: "Error en el servidor al integrar un score"});
                }else{
                    if(team){
                        res.status(200).send({message: "Se integró con exito", score});
                    }else{
                        res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                    }
                }
            });
        
    }else{
        res.status(500).send({message:"No puedes agregar los equipos"});
    }
}

function editScore(req, res){
    var params = req.body;
    var idUsuario = req.params.idUsuario;
    var idScore =  req.params.idScore;
    var data = req.user;
    
    var schema = {};
    params.name?schema.name=params.name:null;
    params.teamOne?schema.teamOne=params.teamOne:null;
    params.pointsOne?schema.pointsOne=params.pointsOne:null;
    params.teamTwo?schema.teamTwo=params.teamTwo:null;
    params.pointsTwo?schema.pointsTwo=params.pointsTwo:null;
    
    data.rol == "ADMIN"?schema.score = idScore:null;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        teamsModel.findByIdAndUpdate(idTeam, schema, {new: true}, (err, edited) =>{
            if(err){
                res.status(500).send({message: "Error en el servidor al editar un score"});
            }else{
                if(edited){
                    res.status(200).send({message: "Se editó con exito", edited});
                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        })
    }else{
        res.status(403).send({message: "No puedes editar este score"});
    }
}

function deleteScore(req, res){
    var idUsuario = req.params.idUsuario;
    var idScore =  req.params.idScore;
    var data = req.user;
    
    data.rol == "ADMIN"?schema.score = idScore:null;

    if(data.rol == "ADMIN" || (data.rol == "CLIENT" && data.sub == idUsuario)){
        teamsModel.findByIdAndDelete(idTeam,(err, delited) =>{
            if(err){
                res.status(500).send({message: "Error en el servidor al eliminar un score"});
            }else{
                if(edited){
                    res.status(200).send({message: "Se elimino con exito", delited});
                }else{
                    res.status(404).send({message: "Datos nulos como respuesta del servidor"});
                }
            }
        })
    }else{
        res.status(403).send({message: "No puedes eliminar este score"});
    }
}

module.exports = {
    getScore,
    addScore,
    editScore,
    deleteScore


}