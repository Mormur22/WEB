/* APLICACIONES WEB. Práctica voluntaria 2: El gestor de tareas (II). Grupo 33: Daniel Compán López de Lacalle y Alejandro Moreno Murillo */

"use strict";

let taskList = [
    {text:"Preparar prácticas AW", tags:["universidad","awt"]},
    {text: "Mirar fechas congreso", done: true, tags:[]},
    {text: "Ir al supermercado", tags: ["personal", "básico"]},
    {text: "Jugar al fútbol", done: false, tags:["personal", "deportes"]},
    {text: "Hablar con profesor", done: false, tags:["universidad", "tp2"]}
];

function taskToSring(task) {
    let s = "Tarea : "
    if("text" in task) { s = s + task.text; } else { s = s + "text undefined"; };
    if("done" in task) { s = s + " | done: " + task.done; } else { s = s + " | done: undefined"; };
    if("tags" in task) { s = s + " | [" + task.tags.join(", ") + "]"; } else { s = s + " | tags undefined" };
    return s;
}

function printTask(task){
    console.log(taskToSring(task));
}

function printTasks(tasks) {
    if(tasks instanceof Array) {
        if(tasks.length != 0) {
            //tasks.forEach(t => { console.log(taskToSring(t)); });
            let str = tasks.reduce((ac, v) => ac + taskToSring(v) + "\n" , "" );
            console.log(str.substring(0,str.length-1));    
        }
        else {
            console.log("No hay tareas (array vacio).");
        }
    }
    else { 
        console.log("Error: parámetro no valido.");
    }
};

/* EJERCICIO 1 */
function getToDoTasks(tasks) {
    return tasks.filter( v => "done" in v ? !v.done : true  );
}

function findDone(tasks) {
    return tasks.filter( v => "done" in v ? v.done : false );
}

/* EJERCICIO 2 */
function findByTag(tasks, tag) {
    return tasks.filter( v => "tags" in v ? (v.tags.includes(tag)) : false );
};

/* EJERCICIO 3 */
function findByTags(tasks, tags) {
    return tasks.filter( v => "tags" in v ? ( v.tags.some( w => tags.includes(w)) ) : false );
}

/* EJERCICIO 4 */
function countDone(tasks) {
    return tasks.reduce( (ac, v) => "done" in v ? (v.done ? ac + 1 : ac) : ac, 0 );
}

/* EJERCICIO 5 */
function setProperty(obj, key, value) {
    obj[key]=value;
    return obj;
}
//También se puede usar en su lugar: Object.assign(obj, { key: value }) 

function createTask(phrase) {
    return phrase.split(" ").reduce( (ac,v) => v[0]=="@" ? setProperty(ac,"tags", [...ac.tags,v.substring(1,v.length)]) : (ac.text.length>0 ? setProperty(ac,"text",ac.text+" "+v) : setProperty(ac,"text",v)) , {text: "", tags:[]} );
}
if(x>10) f1(x)
else f2(x)

x>10 ? f1(x) : f2(x)
/* EJEMPLOS */
console.log("\nEJEMPLOS");
console.log("--------");

console.log("\nTODAS LAS TAREAS: ");
printTasks(taskList);
console.log(countDone(taskList) + " terminadas.");

console.log("\nTAREAS PENDIENTES: ");
let pendingTasks = getToDoTasks(taskList);
printTasks(pendingTasks);
console.log(countDone(pendingTasks) + " terminadas.");

console.log("\nTAREAS COMPLETADAS: ");
let doneTasks = findDone(taskList);
printTasks(doneTasks);
console.log(countDone(taskList) + " terminadas.");

console.log("\nTAREAS PERSONALES: ");
let personalTasks = findByTag(taskList,"personal");
printTasks(personalTasks);
console.log(countDone(personalTasks) + " terminadas.");

console.log("\nTAREAS UNIVERSITARIAS: ");
let universityTasks = findByTag(taskList,"universidad");
printTasks(universityTasks);
console.log(countDone(universityTasks) + " terminadas.");

console.log("\nTAREAS PERSONALES Y UNIVERSITARIAS: ");
let personalAndUniversityTasks = findByTags(taskList, ["personal", "universidad"]);
printTasks(personalAndUniversityTasks);
console.log(countDone(personalAndUniversityTasks) + " terminadas.");

console.log("\nTAREAS DEPORTIVAS: ");
let sportTasks = findByTag(taskList,"deportes");
printTasks(sportTasks);
console.log(countDone(sportTasks) + " terminadas.");

console.log("\nTAREAS BÁSICAS: ");
let basicTasks = findByTag(taskList,"básico");
printTasks(basicTasks);
console.log(countDone(basicTasks) + " terminadas.");

console.log("\nTAREAS DEPORTIVAS Y BÁSICAS: ");
let sportAndBasicTasks = findByTags(taskList, ["deportes", "básico"]);
printTasks(sportAndBasicTasks);
console.log(countDone(sportAndBasicTasks) + " terminadas.");

console.log("\nTAREAS IMPORTANTES: ");
let importantTasks = findByTag(taskList,"importante");
printTasks(importantTasks);
console.log(countDone(importantTasks) + " terminadas.");

console.log("\nNUEVAS TAREAS: ");
console.log("crear tarea \"Ir al medico @personal @salud\"");
let newTask1 = createTask("Ir al medico @personal @salud");
printTask(newTask1);
console.log("crear tarea \"@universidad @practica Preparar prácticas TP\"");
let newTask2 = createTask("@universidad @practica Preparar prácticas TP");
printTask(newTask2);
console.log("crear tarea \"Ir a @deporte entrenar\"");
let newTask3 = createTask("Ir a @deporte entrenar");
printTask(newTask3);
