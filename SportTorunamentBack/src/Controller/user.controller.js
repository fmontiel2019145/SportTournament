"use strict";
//Imports
var User = require("../Models/user.model");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../Service/jwt");
const { schema } = require("../Models/user.model");

//Registrar Usuarios
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
      if (err) return res.status(500).send({ message: "Error en la peticion" });

      if (userFound && userFound.length >= 1) {
        return res.status(500).send({ message: "El usuario ya existe" });
      } else {
        bcrypt.hash(params.password, null, null, (err, passwordEncrypted) => {
          userModel.password = passwordEncrypted;
          userModel.save((err, userSaved) => {
            if (err)
              return res
                .status(500)
                .send({ message: "Error al guardar usuario" });

            if (userSaved) {
              return res.status(200).send({ userSaved });
            }
          });
        });
      }
    });
  } else {
    return res.status(500).send({ message: "Ingrese todos los parametros" });
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
      if (err) return res.status(500).send({ message: "Error en la peticion" });

      if (userFound) {
        bcrypt.compare(
          params.password,
          userFound.password,
          (err, passVerified) => {
            if (passVerified) {
              return res.status(200).send({ token: jwt.createToken(userFound),
              });
             /* if (params.getToken === "true") {
                
                

              } else {
                
                userFound.password = undefined;
                return res.status(200).send({ userFound});
              }*/
            } else {
              return res
                .status(401)
                .send({ message: "Verifica tu correo y contraseña" });
            }
          }
        );
      } else {
        return res.status(500).send({ message: "El usuario no existe" });
      }
      
    }
  );
}

//Obtener Usuarios
function getUsers(req, res) {
  User.find().exec((err, usersFound) => {
    if (err) return res.status(500).send({ message: "Error en la peticion" });

    if (!usersFound)
      return res
        .status(500)
        .send({ message: "Error en las consulta obtener usuarios" });
    return res.status(200).send({ usersFound });
  });
}

//Editar usuarios
function editUser(req, res) {
  var dataToken = req.user;
  var params = req.body;
  var idUsuario = req.params.idUsuario;

  var schemaUpdate = {};
  params.name ? (schemaUpdate.name = params.name) : null;
  params.email ? (schemaUpdate.email = params.email) : null;
  params.user ? (schemaUpdate.name = params.user) : null;
  params.password
    ? (schemaUpdate.name = bcrypt.hashSync(params.password))
    : null;
  params.rol ? (schemaUpdate.rol = params.rol) : null;

  /*
        Verifica si es administrador y si es eso podrá editar cualquier usuario con el id enviado.
        Ahora si es usuario verifica que sea su propia cuenta para poder editar, de lo contrario mandara que no tiene permisos
    */
  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    User.findByIdAndUpdate(
      idUsuario,
      schemaUpdate,
      { new: true },
      (err, userEdited) => {
        if (err) {
          res.status(500).send({ message: err });
        } else {
          if (userEdited) {
            res.status(200).send(userEdited);
          } else {
            res
              .status(404)
              .send({ message: "No se encontró el usuario para editar" });
          }
        }
      }
    );
  } else {
    res.status(403).send({ message: "No tienes acceso" });
  }
}

//Eliminar usuario
function deleteUser(req, res) {
  var dataToken = req.user;
  var idUsuario = req.params.idUsuario;

  if (
    dataToken.rol == "ADMIN" ||
    (dataToken.rol == "CLIENT" && dataToken.sub == idUsuario)
  ) {
    User.findByIdAndDelete(idUsuario, (err, userDelete) => {
      if (err) return res.status(500).send({ message: "Error en la peticion" });
      if (!userDelete)
        return res
          .status(404)
          .send({ message: "No se ha encontrado el usuario para eliminar" });

      return res.status(200).send({ message: "Usuario eliminado con exito" });
    });
  } else {
    res.status(403).send({ message: "No tienes acceso" });
  }
}

module.exports = {
  saveUser,
  login,
  getUsers,
  deleteUser,
  editUser,
};
