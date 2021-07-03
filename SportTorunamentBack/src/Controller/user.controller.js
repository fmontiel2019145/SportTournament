"use strict";

//Imports
//const { schema } = require("../Models/user.model");
var User = require("../Models/user.model");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../Service/jwt");


//Register User
function saveUser(req, res) {
  var userModel = new User();
  var params = req.body;

  if (params.name && params.email && params.user && params.password) {
    userModel.name = params.name;
    userModel.email = params.email;
    userModel.user = params.user;
    
    User.find({
      $or: [{ user: userModel.user }, { email: userModel.email }],
    }).exec((err, userFound) => {
      
      if (err){
        
        res.status(500).send({ message: "Error en la peticion" });
      
      }else{
      
        if (userFound && userFound.length >= 1) {
          
          res.status(500).send({ message: "El usuario ya existe" });
        
        }else{
          
          bcrypt.hash(params.password, null, null, (err, passwordEncrypted) => {
          userModel.password = passwordEncrypted;
          userModel.save((err, userSaved) => {
            if (err){

              res.status(500).send({ message: "Error al guardar usuario" });

            }

            if (userSaved) {

              login(req, res);
              //res.status(200).send({ userSaved });

            }
          });
        });
      }
    }
    });
  
}else{
  res.status(400).send({ message: "No existe este rol" });
}
}

//ADD User
function addUser(req, res) {
  var userModel = new User();
  var params = req.body;
  var dataToken = req.user;
  if (params.name && params.email && params.user && params.password && params.rol) {
    userModel.name = params.name;
    userModel.email = params.email;
    userModel.user = params.user;
    userModel.rol = params.rol;

    if(dataToken.rol == "ADMIN" && (userModel.rol == "ADMIN" || userModel.rol == "CLIENT")){
      User.find({
        $or: [{ user: userModel.user }, { email: userModel.email }],
      }).exec((err, userFound) => {
      
        if (err){
        
          res.status(500).send({ message: "Error en la peticion" });
      
        }else{
      
          if (userFound && userFound.length >= 1) {
          
            res.status(500).send({ message: "El usuario ya existe" });
        
          }else{
          
            bcrypt.hash(params.password, null, null, (err, passwordEncrypted) => {
              userModel.password = passwordEncrypted;
              userModel.save((err, userSaved) => {
                if (err){

                  res.status(500).send({ message: "Error al guardar usuario" });

                }

                if (userSaved) {

                  res.status(200).send({ token: jwt.createToken(userSaved) });

                }
              });
            });
          }
        }
      });
    }else{
    res.status(400).send({ message: "no tienes acceso o No existe el rol agregado" });
    }
  }
}
//Login
function login(req, res) {
  var params = req.body;
    User.findOne(
        {
            email: params.email,
        },
        (err, userFound) => {
            if (err){
                res.status(500).send({ message: "Error en la peticion" });
            }else{
                if (userFound) {
                    bcrypt.compare(params.password, userFound.password, (err, passVerified) => {
                        if (passVerified) {
                                res.status(200).send({ token: jwt.createToken(userFound) });
                        } else {
                            res.status(401).send({ message: "Verifica tu correo y contraseña" });
                        }
                    });
                } else {
                    res.status(500).send({ message: "El usuario no existe" });
                }
            }
        }
    );  
}

//List Users
function getUsers(req, res) {
  var dataToken = req.user;
  if(dataToken.rol == "ADMIN"){
  User.find().exec((err, usersFound) => {
    if (err){ 
      res.status(500).send({ message: "Error en la peticion" });
    }else{
      if (!usersFound){
      res
        .status(500)
        .send({ message: "Error en las consulta obtener usuarios" });
      }else{
        res.status(200).send({ usersFound });
      }
    }   
  });
  }else{
    res.status(500).send({ message: "No tienes acceso" });
  }
}

//Edit User
function editUser(req, res){
  var dataToken = req.user;
  var params = req.body;
  var idUsuario =  req.params.idUsuario;
  var userModel = User;

  var schemaUpdate = {};
  params.name?schemaUpdate.name=params.name:null;
  params.email?schemaUpdate.email=params.email:null;
  params.user?schemaUpdate.name=params.user:null;
  params.password?schemaUpdate.name= bcrypt.hashSync(params.password):null;
  dataToken.rol == "ADMIN"?params.rol?schemaUpdate.rol=params.rol:null:null;
  
  console.log(dataToken.sub)
  console.log(idUsuario)
  userModel.findById(idUsuario, (err, usuario) => {
      if(err){
          res.status(500).send({message : err});
      }else{
          if(usuario && (usuario.rol != "ADMIN" || dataToken.sub == idUsuario)){
              if(dataToken.rol == "ADMIN" || (dataToken.rol == "ADMIN" && dataToken.sub == idUsuario) || (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)){
                  User.findByIdAndUpdate(idUsuario, schemaUpdate ,{new: true}, (err, userEdited) => {
                      if(err){
                          res.status(500).send({message : err});
                      }else{
                          if(userEdited){
                            res.status(200).send({ token: jwt.createToken(userEdited) });
                              
                          }else{
                              res.status(404).send({message : "No se encontró el usuario para editar"});
                          }
                      }
                      
                  });
              }else{
                  res.status(403).send({message : "No tienes acceso"});
              }
          }else{
            if(!usuario){
              res.status(404).send({message : "No se encontró el usuario para editar"});
            }else{
              res.status(403).send({message : "No tienes acceso"});
          }
          }
      }
  });
}
//Delete User
function deleteUser(req, res){
  var dataToken = req.user;
  var idUsuario =  req.params.idUsuario;
  var userModel = User;

  userModel.findById(idUsuario, (err, usuario) => {
      if(err){
          res.status(500).send({message : err});
      }else{
          if(usuario && (usuario.rol != "ADMIN" || dataToken.sub == idUsuario)){
              if(dataToken.rol == "ADMIN" || (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)){
                  User.findByIdAndDelete(idUsuario, (err, userDelete)=> {
                      if(err)return res.status(500).send({message:"Error en la peticion"})
                      if(!userDelete)return res.status(404).send({message:'No se ha encontrado el usuario para eliminar'})

                      return res.status(200).send({message:'Usuario eliminado con exito'})
                  });
              }else{
                  res.status(403).send({message : "No tienes acceso"});
              }
          }else{
              if(!usuario){
                  res.status(404).send({message : "No se encontró el usuario para editar"});
              }else{
                  res.status(403).send({message : "No tienes acceso"});
              }
          }
      }
  });
}

//Exports
module.exports = {
  saveUser,
  addUser,
  login,
  getUsers,
  deleteUser,
  editUser,
};



//Verifica si es administrador y si es eso podrá editar cualquier usuario con el id enviado.
//Ahora si es usuario verifica que sea su propia cuenta para poder editar, de lo contrario mandara que no tiene permisos