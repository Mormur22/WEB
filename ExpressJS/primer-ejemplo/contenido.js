"use strict";
const express = require("express");
const app = express();

var usuarios = ["Javier Montoro", "Dolores Vega", "Beatriz Nito"];
app.get("/users.html", function(request, response) {
    response.status(200);
    response.type("text/html");
    response.write("<html>");
    response.write("<head>");
    response.write("<title>Lista de usuarios</title>");
    response.write('<meta charset="utf-8">')
    response.write("</head>");
    response.write("<body>");
    response.write("<h1>Ejemplo de contenido html desde Express.js</h1>");
    response.write("<ul>");
    usuarios.forEach((usuario) => {
        response.write(`<li>${usuario}</li>`);
    });
    response.write("</ul>");
    response.write("</body>");
    response.end("</html>");
});

app.listen(3000, function (err) {
    if (err)
        console.log("No se pudo inicializar el servidor: " + err.error)
    else
        console.log("Servidor arrancado en el puerto 3000");
});