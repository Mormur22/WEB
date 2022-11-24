"use strict"

var fs = require("fs");
const path = require("path");
console.log(__dirname);
console.log(__filename);


let contenidoFichero;
fs.readFile("fichero.txt",
            { encoding: "utf-8" },
            function(err, contenido) {
                if (!err) {
                    // Asignamos el contenido a la variable
                    // externa
                    contenidoFichero = contenido;
                    console.log(contenidoFichero);
                }else
                    console.log("Error leyendo el fichero...");
            });

 console.log(path.parse(__filename));
    // Escritura de un fichero:
    for (let i=1; i<5; i++) {
        let fichero = "f" + i + ".txt";
        console.log("Solicitada la escritura del fichero " + fichero);
        fs.writeFile(fichero,fichero,function(err) {
            if (!err) {
                console.log("Terminada la escritura del fichero" + fichero);
            }
        });
    }

    console.log("Lectura binaria de un fichero");
    fs.readFile("ejemplo.pdf", function(err, buffer) {
        if (!err) {
            // Obtenemos los cuatro primeros bytes
            const mark = buffer.slice(0,4);
            // Y los imprimimos con la codificación ASCII
            console.log("mark: " + mark.toString("ascii"));
         //   console.log("buffer: " + buffer);
        }else
            console.log("error en la lectura binaria");
    }); 