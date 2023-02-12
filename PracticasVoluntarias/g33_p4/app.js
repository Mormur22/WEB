// app.js
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
// Crear un servidor Express.js
const app = express();
// watch front-end changes
// Crear un pool de conexiones a la base de datos de MySQL
const MySQLStore = mysqlSession(session);
const pool = mysql.createPool(config.mysqlConfig);
const sessionStore = new MySQLStore(config.mysqlConfig);
// Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);
const uti= new utils();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended:true}));
//Ubicacion Archivos estaticos
app.use(express.static(path.join(__dirname, "public")));
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});



app.use(middlewareSession);
// Arrancar el servidor
app.listen(3000, function(err) {

    if (err) {
    console.log("ERROR al iniciar el servidor");
    }

    else {
    console.log(`Servidor arrancado en el puerto ${3000}`);
    }
});



app.get("/tasks", (request, response) => {
    
        daoT.getAllTasks('usuario@ucm.es',function(err, listaTask) {
            if(err) {
                response.status(500); 
                console.log(err.message);
            } else {
                response.status(200);
                console.log(listaTask)
                response.render("tasks.ejs",{listaTask:listaTask});
            }
        });
});

app.post("/addTask", (request, response) => {
    
    console.log(request.body);
    let tarea= uti.createTask(request.body.desc);
    console.log(tarea);
    daoT.insertTask('usuario@ucm.es',tarea,function(err){
        if(err) {
            console.log(err.message);
        }
        response.status(200);
        response.redirect("/tasks");
    });
});

app.get("/finish/:task_id",(request, response)=>{
    
    console.log(request.params);

    daoT.markUserTaskDone('usuario@ucm.es',request.params.task_id,function(err) {
        if(err) {
            response.status(500); 
            console.log(err.message);
        }

        else{
            response.status(200);
            response.redirect("/tasks");
        }
    });
    response.redirect("/tasks");
    daoT.getAllTasks('usuario@ucm.es',function(err, listaTask) {
        if(err) {
            response.status(500); 
            console.log(err.message);
        } else {
            console.log(listaTask)
            response.render("tasks.ejs",{listaTask:listaTask});
        }
    });
});

app.get("/deletecompleted", (request, response) => {
    console.log("dentro");
    daoT.deleteCompleted('usuario@ucm.es',function(err) {
        if(err) {
            response.status(500); 
            console.log(err.message);
        }
            console.log("funciona");
            response.status(200);
            response.redirect("/tasks");
    });
});




module.exports = app;
