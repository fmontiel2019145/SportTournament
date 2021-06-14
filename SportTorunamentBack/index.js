// IMPORTS
const mongoose = require("mongoose");
const app = require("./app");
const bcrypt = require("bcrypt-nodejs");
const UserModel = require("./src/Models/user.model"); 

mongoose.Promise = global.Promise;
//mongodb://localhost:27017/dbTorneo
mongoose
    .connect("mongodb+srv://TorneosDeporte:a1b2c3d4e5@cluster0.aavqv.mongodb.net/dbTorneosDeportes?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Se encuentra conectado a la base de datos");
        initApp();

        app.listen(3000, function () {
            console.log("Servidor corriendo en el puerto 3000");
        });
    })
    .catch((err) => console.log(err));

function initApp(){
    forCustomAdmin();
    forCustomClient();
}

function forCustomAdmin(){
    UserModel.findOne({email:"admin@email.com"}, (err, user) => {
        if(err){
            console.log(err);
        }else{
            if(!user){
                modelo = new UserModel({
                    name: "admin",
                    email: "admin@email.com",
                    user: "admin",
                    rol: "ADMIN",
                    password: bcrypt.hashSync("123456")
                });
                modelo.save();

                console.log("Administrador por defecto creado");
            }else{
                console.log("Ya existe el administrador por defecto");
            }
        }
    });
}

function forCustomClient(){
    UserModel.findOne({email:"client@email.com"}, (err, user) => {
        if(err){
            console.log(err);
        }else{
            if(!user){
                modelo = new UserModel({
                    name: "client",
                    email: "client@email.com",
                    user: "client",
                    password: bcrypt.hashSync("123456")
                });
                modelo.save();

                console.log("Cliente por defecto creado");
            }else{
                console.log("Ya existe el cliente por defecto");
            }
        }
    });
}
