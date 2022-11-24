"use strict";
const mysql = require("mysql");
const config = require("./config");
const PORT = process.env.PORT || config.puerto;
const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");
// Crear el pool de conexiones

const pool = mysql.createPool(config.databaseConfig);

let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);
// Definición de las funciones callback
// Uso de los métodos de las clases DAOUsers y DAOTasks

daoUser.isUserCorrect("aitor.tilla@ucm.es", "aitor", cb_isUserCorrect);
function cb_isUserCorrect(err, result){
 if (err) {
 console.log(err.message);
 } else if (result) {
 console.log("Usuario y contraseña correctos");
 } else {
 console.log("Usuario y/o contraseña incorrectos");
 }
}

daoUser.getUserImageName("aitor.tilla@ucm.es", cd_getUserImageName);

function cd_getUserImageName(err,result){
    if (err) {
        console.log(err.message);
        } 
    else if (result) {
        console.log(result);
    } 
    else {
        console.log("Usuario incorrecto");
    }

}

daoTask.getAllTasks("aitor.tilla@ucm.es", cd_getAllTasks);

function cd_getAllTasks(err,result){
    if (err) {
        console.log(err.message);
        } 
    else if (result) {

       var array=result.reduce(function (previous, current) {
            if(previous.idTarea===current.idTarea)
            {
                return [previous.idTarea]
            }
        }, array[0])
    } 
    else {
        console.log("Usuario incorrecto");
    }

}


