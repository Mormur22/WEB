// app.js
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const DAOUsers = require("./DAOUsers")
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");

// Crear un servidor Express.js
const app = express();
// watch front-end changes
// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);
// Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);
const daoU = new DAOUsers(pool);
const uti= new utils();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended:true}));
//Ubicacion Archivos estaticos
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: true,
    store: sessionStore
});
app.use(middlewareSession);


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

var almacen = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'public', 'img'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
  });

const multerFactory = multer({ storage: almacen });

app.get("/login", (request, response) => {
    if(request.session.currentUser===undefined){
        response.status(200);
        response.render("login", {  
                title: "Página de inicio de sesión",
                msgRegistro: null});
    }
});

app.post("/login_user", multerFactory.none(),(request, response) => {

    daoU.isUserCorrect(request.body.correo, request.body.password, function(err, loginExito) {

        if(loginExito){
            response.status(200);
            request.session.currentUser= request.body.correo;
            response.locals.currentUser = request.session.currentUser;
            console.log("login")
            response.redirect("/tasks");
        }

        else{
            response.status(500);
            
            response.render("login", {  
                        title: "Error", 
                        msgRegistro: err, 
                        tipoAlert: "alert-danger"
                        });
            }
    });
    
});

app.use(function(request, response, next) {
    if (request.session.currentUser!== undefined) {
        response.locals.currentUser = request.session.currentUser;
        next();
    } else {
        
        response.redirect("/login");
    }
});

app.get("/tasks", (request, response) => {
    
        daoT.getAllTasks(response.locals.currentUser,function(err, listaTask) {
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
    daoT.insertTask(response.locals.currentUser,tarea,function(err){
        if(err) {
            console.log(err.message);
        }
        response.status(200);
        response.redirect("/tasks");
    });
});

app.get("/finish/:task_id",(request, response)=>{
    
    console.log(request.params);

    daoT.markUserTaskDone(response.locals.currentUser,request.params.task_id,function(err) {
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
    daoT.getAllTasks(response.locals.currentUser,function(err, listaTask) {
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
    daoT.deleteCompleted(response.locals.currentUser,function(err) {
        if(err) {
            response.status(500); 
            console.log(err.message);
        }
            console.log("funciona");
            response.status(200);
            response.redirect("/tasks");
    });
});

app.use("/imagenUsuario", (request, response) => {
    console.log("img");
    daoU.getUserImageName(response.locals.currentUser,function(err,filename) {
        if(err) {
            response.status(500); 
            console.log(err.message);
        }
        else{
            console.log(filename);
            if(filename){
                response.status(200);       
                console.log(path.join(__dirname,"profile_imgs",filename));
                response.sendFile(path.join(__dirname,"profile_imgs",filename));
                
            }

            else{
                response.status(200);       
                console.log(path.join(__dirname,'public', 'img', 'user-default.jpg'));
                response.sendFile(path.join(__dirname,'public', 'img', 'user-default.jpg'));
               
            }
        }
    });
});

app.get("/logout",(request, response) => {
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
});

app.use(function(request, response, next) { 
    response.status(404);
    response.render("error404", { url: request.url });
});

//Errores de servidor
app.use(function(error, request, response, next) {
    response.status(500); 
    response.render("error500", {
        mensaje: error.message, 
        pila: error.stack });
});





module.exports = app;
