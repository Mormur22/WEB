
let listaTareas = [
    {text:"Preparar prácticas AW",  done: false, tags:["deportes","awt"]}
, {text: "Mirar fechas congreso", done: true, tags:[]}
    , {text: "Ir al supermercado", done: false,  tags: ["personal", "básico"]}
, {text: "Jugar al fútbol", done: false, tags:["personal", "deportes"]}
, {text: "Hablar con profesor", done: false, tags:["universidad", "tp2"]}
];



function getToDoTask(listaTareas) {
    let tareas= listaTareas.filter(tarea=> tarea.done===false).map(tareas=>tareas.text);
    return tareas;
}

let uno =getToDoTask(listaTareas);
console.log(uno);


let listaTags= ["deportes","awt"];

/*
function findByTags(tasks,listaTags) {
    return tasks.filter( task=> task.tags.some(tag1=> listaTags.some(tag2=>tag1===tag2))===true);
}
*/

function findByTags(tasks, tags) {
    return tasks.filter( v => "tags" in v ? ( v.tags.some( w => tags.includes(w)) ) : false );
}

console.log(findByTags(listaTareas,listaTags));


function createTask(text){
        let parsedArray= text.split(" ");
        let tags = parsedArray.filter(word => /^@/.test(word)).map(noarroba=> noarroba.substring(1));
        let texto = parsedArray.filter(word=> !/^@/.test(word)).join(" ");
        return [texto,tags];

    return phrase.split(" ").reduce( (ac,v) => v[0]=="@" ? setProperty(ac,"tags", [...ac.tags,v.substring(1,v.length)]) : (ac.text.length>0 ? setProperty(ac,"text",ac.text+" "+v) : setProperty(ac,"text",v)) , {text: "", tags:[]} );
}

console.log(createTask("Ir a @deporte entrenar"));





