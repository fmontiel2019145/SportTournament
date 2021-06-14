//Imports
var User = require("../Models/user.model");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");

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
