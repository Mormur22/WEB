const path = require('path');
const express = require('express');
const { response } = require('express');

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));

const PORT = 3000

var usuarios = ["caca", "pedo", "pis"]
app.get("/usuarios", (request, response) => {
    
    response.status(200);
    response.render("usuarios",{users:usuarios});
    }
);

//-----------------------------------Registro --> Login--------------
app.get("/users", (request, response) => {
   
    
});

//-- Pagina de registro Login --> Registro
app.get("/socios", (request, response) => {     
    
});


//-- -GESTION DE ERRORES 

//Para errores de direccionamiento


//-- Escucha del servidor
app.listen(PORT, (err) => {
    if (err) {
        console.error(`No se pudo inicializar el servidor: ${err.message}`);
    } else {
        console.log(`Servidor arrancado en el puerto ${ PORT }`);        
    }
});

module.exports = app;