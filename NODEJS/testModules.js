"use strict"
const fib = require("./moduloFib.js");
console.log(fib(10));

const g = require("./geometria.js");
console.log( g .areaCuadrado(10));
console.log( g .areaCirculo(10));

const osHomedir = require ("os-homedir");
console.log(osHomedir());

var table = require('text-table');
var t = table([
    [ 'master', '0123456789', 'abcdef' ],
    [ 'staging', 'fedcba', '9876543210' ]
]);
console.log(t);

const util = require("util");
const mensaje = util.format("Estamos en el año %d", 2021);
console.log(mensaje);

const os = require("os");
console.log(`Nombre del host: ${os.hostname()}`);
console.log(`Directorio personal: ${os.homedir()}`);
