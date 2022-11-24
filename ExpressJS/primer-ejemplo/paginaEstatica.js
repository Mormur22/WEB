"use strict";
const express = require("express");
const app = express();

app.get("/", function(request, response) {
    response.status(200);
    response.type("text/html");
    response.write("<html>");
    response.write("<head>");
    response.write("<title>Lista de usuarios</title>");
    response.write('<meta charset="utf-8">');
    response.write("</head>");
    response.write("<body>");
    response.write("<h1>¡Bienvenido!</h1>");
    response.write("</body>");
    response.end("</html>");
    });

app.listen(3000, function (err) {
    if (err)
        console.log("No se pudo inicializar el servidor: " + err.error)
    else
        console.log("Servidor arrancado en el puerto 3000");
});