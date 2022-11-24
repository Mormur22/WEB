/* APLICACIONES WEB. Práctica voluntaria 3: El gestor de tareas (III). Grupo 33: Daniel Compán López de Lacalle y Alejandro Moreno Murillo */

"use strict";

const mysql = require("mysql");  // Package Module (npm install mysql --save)
const dbConfig = require("./config.js");  // File Module
const DAOUsers = require("./DAOUsers.js");  // File Module
const DAOTasks = require("./DAOTasks.js");  // File Module

// Crear el pool de conexiones

const pool = mysql.createPool(dbConfig);

// Crear los DAO

let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);

// Funciones de impresión

function taskToSring(task) {
    let s = "Tarea : "
    if("text" in task) { s = s + task.text; } else { s = s + "text undefined"; };
    if("done" in task) { s = s + " | done: " + task.done; } else { s = s + " | done: undefined"; };
    if("tags" in task) { s = s + " | [" + task.tags.join(", ") + "]"; } else { s = s + " | tags undefined" };
    return s;
}

function printTask(task){
    console.log(taskToSring(task));
}

function printTasks(tasks) {
    if(tasks instanceof Array) {
        if(tasks.length != 0) {
            //tasks.forEach(t => { console.log(taskToSring(t)); });
            let str = tasks.reduce((ac, v) => ac + taskToSring(v) + "\n" , "" );
            console.log(str.substring(0,str.length-1));    
        }
        else {
            console.log("No hay tareas (array vacio).");
        }
    }
    else { 
        console.log("Error: parámetro no valido.");
    }
};

// Definición de las funciones callback

function cb_isUserCorrect(err, result) {
    if(err) {
        console.log(err.message);
    } else if(result) {
        console.log("Usuario y contraseña correctos");
    } else {
        console.log("Usuario y/o contraseña incorrectos");
    }
};

function cb_getUserImageNam(err, result) {
    if(err) {
        console.log(err.message);
    } else {
        console.log(result);
    }
};

function cb_getAllTasks(err, result) {
    if(err) {
        console.log(err.message);
    } else {
        printTasks(result);
    }
};

function cb_markTaskDone(err) {
    if(err) {
        console.log(err.message);
    }
};

function cb_markUserTaskDone(err) {
    if(err) {
        console.log(err.message);
    }
};

function cb_deleteCompleted(err) {
    if(err) {
        console.log(err.message);
    }
};

function cb_insertTask(err) {
    if(err) {
        console.log(err.message);
    }
};

// Uso de los métodos de las clases DAOUsers y DAOTasks

//console.log("daoUser.isUserCorrect(\"usuario@ucm.es\", \"mipass\", cb_isUserCorrect);")
//daoUser.isUserCorrect("usuario@ucm.es", "mipass", cb_isUserCorrect);
//console.log("daoUser.isUserCorrect(\"steve.curros@ucm.es\", \"badpass\", cb_isUserCorrect);");
//daoUser.isUserCorrect("steve.curros@ucm.es", "badpass", cb_isUserCorrect);
//console.log("daoUser.isUserCorrect(\"steve.curros@ucm.es\", \"steve\", cb_isUserCorrect);");
//daoUser.isUserCorrect("steve.curros@ucm.es", "steve", cb_isUserCorrect);

//console.log("daoUser.getUserImageName(\"baduser@ucm.es\", cb_getUserImageNam);");
//daoUser.getUserImageName("baduser@ucm.es", cb_getUserImageNam);
//console.log("daoUser.getUserImageName(\"aitor.tilla@ucm.es\", cb_getUserImageNam);");
//daoUser.getUserImageName("aitor.tilla@ucm.es", cb_getUserImageNam);

//console.log("daoTask.getAllTasks(\"baduser@ucm.es\",cb_getAllTasks);");
//daoTask.getAllTasks("baduser@ucm.es",cb_getAllTasks);
//console.log("daoTask.getAllTasks(\"felipe.lotas@ucm.es\",cb_getAllTasks);");
//daoTask.getAllTasks("felipe.lotas@ucm.es",cb_getAllTasks);
//console.log("daoTask.getAllTasks(\"bill.puertas@ucm.es\",cb_getAllTasks);");
//daoTask.getAllTasks("bill.puertas@ucm.es",cb_getAllTasks);

//console.log("daoTask.insertTask(\"bill.puertas@ucm.es\", { text: \"Comprar cerveza\", done: false, tags: [\"Ocio\", \"Personal\", \"Fiesta\", \"Básico\", \"Finde\"] }, cb_insertTask);");
//daoTask.insertTask("bill.puertas@ucm.es", { text: "Comprar cerveza", done: false, tags: ["Ocio", "Personal", "Fiesta", "Básico", "Finde"] }, cb_insertTask);
//console.log("daoTask.insertTask(\"bill.puertas@ucm.es\", { text: \"Hablar con el profesor\", done: false, tags: [\"Universidad\", \"Matematicas\"] }, cb_insertTask);");
//daoTask.insertTask("bill.puertas@ucm.es", { text: "Hablar con el profesor", done: false, tags: ["Universidad", "Matematicas"] }, cb_insertTask);

//console.log("daoTask.markTaskDone(0,cb_markTaskDone);");
//daoTask.markTaskDone(0,cb_markTaskDone);
//console.log("daoTask.markTaskDone(1,cb_markTaskDone);");
//daoTask.markTaskDone(1,cb_markTaskDone);
//console.log("daoTask.markTaskDone(2,cb_markTaskDone);");
//daoTask.markTaskDone(2,cb_markTaskDone);

//console.log("daoTask.markUserTaskDone(\"baduser@ucm.es\", 1, cb_markUserTaskDone);");
//daoTask.markUserTaskDone("baduser@ucm.es", 1, cb_markUserTaskDone);
//console.log("daoTask.markUserTaskDone(\"bill.puertas@ucm.es\", 0, cb_markUserTaskDone);");
//daoTask.markUserTaskDone("bill.puertas@ucm.es", 0, cb_markUserTaskDone);
//console.log("daoTask.markUserTaskDone(\"bill.puertas@ucm.es\", 4, cb_markUserTaskDone);");
//daoTask.markUserTaskDone("bill.puertas@ucm.es", 4, cb_markUserTaskDone);

//console.log("daoTask.deleteCompleted(\"steve.curros@ucm.es\", cb_deleteCompleted);");
//daoTask.deleteCompleted("bill.puertas@ucm.es", cb_deleteCompleted);

console.log("END");
