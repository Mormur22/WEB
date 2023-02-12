/* APLICACIONES WEB. Práctica voluntaria 2: El gestor de tareas (II). Grupo 33: Daniel Compán López de Lacalle y Alejandro Moreno Murillo */

"use strict";

class utils {

    taskToSring(task) {
        let s = "Tarea : "
        if("text" in task) { s = s + task.text; } else { s = s + "text undefined"; };
        if("done" in task) { s = s + " | done: " + task.done; } else { s = s + " | done: undefined"; };
        if("tags" in task) { s = s + " | [" + task.tags.join(", ") + "]"; } else { s = s + " | tags undefined" };
        return s;
    }

    printTask(task){
        console.log(taskToSring(task));
    }

    printTasks(tasks) {
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
    getToDoTasks(tasks) {
        return tasks.filter( v => "done" in v ? !v.done : true  );
    }

    findDone(tasks) {
        return tasks.filter( v => "done" in v ? v.done : false );
    }

    /* EJERCICIO 2 */
    findByTag(tasks, tag) {
        return tasks.filter( v => "tags" in v ? (v.tags.includes(tag)) : false );
    };

    /* EJERCICIO 3 */
    findByTags(tasks, tags) {
        return tasks.filter( v => "tags" in v ? ( v.tags.some( w => tags.includes(w)) ) : false );
    }

    /* EJERCICIO 4 */
    countDone(tasks) {
        return tasks.reduce( (ac, v) => "done" in v ? (v.done ? ac + 1 : ac) : ac, 0 );
    }

    /* EJERCICIO 5 */
    setProperty(obj, key, value) {
        obj[key]=value;
        return obj;
    }
    //También se puede usar en su lugar: Object.assign(obj, { key: value }) 

    createTask(text){
        let parsedArray= text.split(" ");
        let _tags = parsedArray.filter(word => /^@/.test(word)).map(noarroba=> noarroba.substring(1));
        let _text = parsedArray.filter(word=> !/^@/.test(word)).join(" ");
        const obj={
            text: _text,
            tags: _tags,
            done: 0
        }

        return obj;
    }

    //return phrase.split(" ").reduce( (ac,v) => v[0]=="@" ? setProperty(ac,"tags", [...ac.tags,v.substring(1,v.length)]) : (ac.text.length>0 ? setProperty(ac,"text",ac.text+" "+v) : setProperty(ac,"text",v)) , {text: "", tags:[]} );
}


module.exports =utils;