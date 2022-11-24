"use strict";
const express = require("express");
const app = express();
const path = require("path");
app.use(express.static(__dirname + '/public'));

app.get("/", function(request, response) {
    response. sendFile (path.join(__dirname, "public", "presentacion.html"));
    });

app.listen(3000, function (err) {
    if (err)
        console.log("No se pudo inicializar el servidor: " + err.error)
    else
        console.log("Servidor arrancado en el puerto 3000");
});