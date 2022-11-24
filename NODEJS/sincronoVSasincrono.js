"use strict";
const fs = require("fs");

let contenidoFichero;
fs.readFile("fichero.txt",
            { encoding: "utf-8" },
            function(err, contenido) {
                if (!err) {
                    // Asignamos el contenido a la variable
                    // externa
                    contenidoFichero = contenido;
                }
            });
console.log(contenidoFichero); // ¿Qué se imprime aquí?