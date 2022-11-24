const Figura=require("./figura")
const Elipse=require("./elipse")
const Circulo=require("./circulo")

let prueba = new Elipse(1, 1,20,20);
prueba.pintar();
console.log(prueba.esBlanca());

let prueba2 = new Circulo(1, 1,20);
prueba2.pintar();
console.log(prueba2.esBlanca());


