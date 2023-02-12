"use strict";

/**
 * Clase que implementa la funcionalidad relacionada con la gestión de tareas en la BD.
 */
class DAOTasks {

    /**
     * Constrictor de la clase 'DAOTasks'.
     * Crea un objeto con los métodos necesarios para realizar las operaciones de gestión de tareas en la BD.
     * @param pool Pool de conexiones que se usará para conectarse a la BD.
     */
    constructor(pool) {
        this.pool = pool;
    }
    
    /**
     * Devuelve todas las tareas asociadas a un determinado usuario de la BD junto con las etiquetas asociadas a cada una de ellas.
     * @param email Email del usuario. Valor que ha de coincidir con el del campo 'email' de la tabla 'aw_tareas_usuarios' de la BD.
     * @param callback Función de callback que gestiona los casos de error y éxito. Parámetros de entrada: (Error err, [Task , ... , Task] result).
     * Task = { id: Number, text: String, done: Boolean, tags: [String , ... , String] }.
     * Ejecuta la consulta: "SELECT t.idTarea AS id, t.texto AS text, ut.hecho AS done, e.texto AS tag FROM aw_tareas_usuarios u JOIN aw_tareas_user_tareas ut ON u.idUser = ut.idUser JOIN aw_tareas_tareas t ON ut.idTarea = t.idTarea JOIN aw_tareas_tareas_etiquetas te ON t.idTarea = te.idTarea JOIN aw_tareas_etiquetas e ON te.idEtiqueta = e.idEtiqueta WHERE u.email = $email".
     */
    getAllTasks(email, callback) {
        this.pool.getConnection(
            function(err, connection) {
                if(err) {
                    callback(new Error("Error de conexión a la base de datos"));
                }
                else {
                    connection.query("SELECT t.idTarea AS id, t.texto AS text, ut.hecho AS done, e.texto AS tag FROM aw_tareas_usuarios u JOIN aw_tareas_user_tareas ut ON u.idUser = ut.idUser JOIN aw_tareas_tareas t ON ut.idTarea = t.idTarea JOIN aw_tareas_tareas_etiquetas te ON t.idTarea = te.idTarea JOIN aw_tareas_etiquetas e ON te.idEtiqueta = e.idEtiqueta WHERE u.email = ?", [email],
                        function(err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if(err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            } else {
                                if(rows.length === 0) {
                                    callback(new Error("No existe el usuario")); // no existe el usuario con el email proporcionado
                                }
                                else {
                                    const ids = rows.map( r => r.id ).reduce( (ac,id) => ac.indexOf(id) == -1 ? [...ac,id] : ac , []); // lista de ids de tareas sin repetir
                                    const lTags = ids.map( id => rows.filter( r => r.id === id ).map( r => r.tag  ) ); // lista de listas de etiquetas
                                    const lTasks = ids.map( id => rows.find( r => r.id === id ) ); // lista de tareas con 1 etiqueta
                                    const lTasksTags = lTasks.map( (t,i) => { return { id: t.id, text: t.text, done: t.done, tags: lTags[i] } } ); // lista de tareas con lista de etiquetas
                                    callback(null,lTasksTags);
                                }
                            }
                        }
                    );
                }
            }
        );
    }
    // NOTA: se ha añadido el error "No existe el usuario" además de los otros que se piden por consiterarlo oportuno en este caso.

    /**
     * Inserta en la BD la tarea 'task' asociándola al usuario cuyo identificador es 'email'.
     * @param email Email del usuario. Valor que ha de coincidir con el del campo 'email' de la tabla 'aw_tareas_usuarios' de la BD.
     * @param task Tarea a insertar en el la BD. task = { text: String, done: Boolean, tags: [String , ... , String] }.
     * @param callback Función de callback que gestiona los casos de error. Parámetros de entrada: (Error err).
     */
    insertTask(email, task, callback) {
        this.pool.getConnection(
            function(err, connection) {
                if(err) {
                    connection.release();
                    callback(new Error("Error de conexión a la base de datos"));
                }
                else{
                    connection.query("SELECT idUser FROM aw_tareas_usuarios WHERE email = ?", [email],
                        function(err, rows) {
                            if(err) {
                                connection.release();
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else{
                                if(rows.length == 0) {
                                    connection.release();
                                    callback(new Error(`Error. No hay ningún usuario en la base de datos con el email indicado (${email})`));
                                } else if(rows.length > 1) {
                                    connection.release();
                                    callback(new Error(`Error. Se ha encontrado más de 1 usuario con el email indicado (${email})`));
                                }
                                else {
                                    const userId = rows[0].idUser;
                                    connection.query("SELECT idTarea FROM aw_tareas_tareas WHERE texto  = ?", [task.text],
                                        function(err, rows) {
                                            if(err) {
                                                connection.release();
                                                callback(new Error("Error de acceso a la base de datos"));
                                            }
                                            else{
                                                if(rows.length == 0) {
                                                    // No existe el nombre de la tarea en la BD, lo insertamos.
                                                    connection.query("INSERT INTO aw_tareas_tareas VALUES(NULL,?)", [task.text],
                                                        function(err, res) {
                                                            if(err) {
                                                                connection.release();
                                                                callback(new Error("Error de acceso a la base de datos"));
                                                            }
                                                            else{
                                                                if(res.affectedRows == 0){
                                                                    connection.release();
                                                                    callback(new Error("Error al intentar insertar valores"));
                                                                }
                                                                else {
                                                                    // Obtenemos todas las etiquetas y comprobamos cuales no están en la BD para insertarlas
                                                                    const taskId = res.insertId;
                                                                    connection.query("SELECT * FROM aw_tareas_etiquetas;", [],
                                                                        function(err, rows) {
                                                                            if(err) {
                                                                                connection.release();
                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                            }
                                                                            else{
                                                                                const tags = task.tags.reduce( (ac,t) => ac.indexOf(t) == -1 ? [...ac,t] : ac , []); // lista de etiquetas sin repetir
                                                                                const tagsIds = tags.map( t => rows.reduce( (ac,r) => r.texto.toLowerCase() === t.toLowerCase() ? r.idEtiqueta : ac , -1) );
                                                                                if(tagsIds.indexOf(-1) != -1 ) {
                                                                                    // Hay que insertar etiquetas nuevas
                                                                                    let query = tagsIds.reduce( (ac,id,i) => id != -1 ? ac : ac + `('${tags[i]}'), ` , "INSERT INTO aw_tareas_etiquetas (texto) VALUES ");
                                                                                    query = query.substring(0,query.length-2);
                                                                                    connection.query(query, [],
                                                                                        function(err, res) {
                                                                                            if(err) {
                                                                                                connection.release();
                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                            }
                                                                                            else{
                                                                                                if(res.affectedRows == 0){
                                                                                                    connection.release();
                                                                                                    callback(new Error("Error al intentar insertar valores"));
                                                                                                }
                                                                                                else {
                                                                                                    // Ahora están todas las etiquetas en la BD, recuperamos sus identificadores
                                                                                                    connection.query("SELECT * FROM aw_tareas_etiquetas;", [],
                                                                                                        function(err, rows) {
                                                                                                            if(err) {
                                                                                                                connection.release();
                                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                                            }
                                                                                                            else{
                                                                                                                // Insertamos los identificadores en la tabla de relacion "aw_tareas_tareas_etiquetas"
                                                                                                                const allTagsIds = tags.map( t => rows.reduce( (ac,r) => r.texto.toLowerCase() === t.toLowerCase() ? r.idEtiqueta : ac , -1) );
                                                                                                                let query = allTagsIds.reduce( (ac,id) => ac + `(${taskId},${id}), ` , "INSERT INTO aw_tareas_tareas_etiquetas (idTarea, idEtiqueta) VALUES ");
                                                                                                                query = query.substring(0,query.length-2);
                                                                                                                connection.query(query, [],
                                                                                                                    function(err, res) {
                                                                                                                        if(err) {
                                                                                                                            connection.release();
                                                                                                                            callback(new Error("Error de acceso a la base de datos"));
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            if(res.affectedRows == 0){
                                                                                                                                connection.release();
                                                                                                                                callback(new Error("Error al intentar insertar valores"));
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                // Asignamos la tarea al usuario
                                                                                                                                connection.query("INSERT INTO aw_tareas_user_tareas VALUES (?, ?, ?)", [userId, taskId, task.done],
                                                                                                                                    function(err, res) {
                                                                                                                                        connection.release();
                                                                                                                                        if(err) {
                                                                                                                                            callback(new Error("Error de acceso a la base de datos"));
                                                                                                                                        }
                                                                                                                                        else{
                                                                                                                                            if(res.affectedRows == 0){
                                                                                                                                                callback(new Error("Error al intentar insertar valores"));
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                );
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                );
                                                                                                            }
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }
                                                                                else {
                                                                                    // No hay que insertar etiquetas nuevas
                                                                                    // Insertamos los identificadores en la tabla de relacion "aw_tareas_tareas_etiquetas"
                                                                                    let query = tagsIds.reduce( (ac,id) => ac + `(${taskId},${id}), ` , "INSERT INTO aw_tareas_tareas_etiquetas (idTarea, idEtiqueta) VALUES ");
                                                                                    query = query.substring(0,query.length-2);
                                                                                    connection.query(query, [],
                                                                                        function(err, res) {
                                                                                            if(err) {
                                                                                                connection.release();
                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                            }
                                                                                            else{
                                                                                                if(res.affectedRows == 0){
                                                                                                    connection.release();
                                                                                                    callback(new Error("Error al intentar insertar valores"));
                                                                                                }
                                                                                                else {
                                                                                                    // Asignamos la tarea al usuario
                                                                                                    connection.query("INSERT INTO aw_tareas_user_tareas VALUES (?, ?, ?)", [userId, taskId, task.done],
                                                                                                        function(err, res) {
                                                                                                            connection.release();
                                                                                                            if(err) {
                                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                                            }
                                                                                                            else{
                                                                                                                if(res.affectedRows == 0){
                                                                                                                    callback(new Error("Error al intentar insertar valores"));
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    );
                                                } else if(rows.length >= 1) {
                                                    // Existe el nombre de la tarea en la BD, comprobamos si tiene las mismas etiquetas.
                                                    const taskId = rows[0].idTarea
                                                    connection.query("SELECT e.idEtiqueta, e.texto FROM aw_tareas_tareas_etiquetas te JOIN aw_tareas_etiquetas e ON te.idEtiqueta = e.idEtiqueta WHERE te.idTarea = ? ", [taskId],
                                                        function(err, rows) {
                                                            if(err) {
                                                                connection.release();
                                                                callback(new Error("Error de acceso a la base de datos"));
                                                            }
                                                            else{
                                                                const tags = task.tags.reduce( (ac,t) => ac.indexOf(t) == -1 ? [...ac,t] : ac , []); // lista de etiquetas sin repetir
                                                                if(tags.length === rows.length && tags.every( t => rows.some( r => r.texto.toLowerCase() == t.toLowerCase() ) ) ){
                                                                    // Tiene exactamente las mismas etiquetas, la tarea ya está en la BD, comprobamos si el usuario ya la tiene asignada.
                                                                    connection.query("SELECT * FROM aw_tareas_user_tareas ut WHERE ut.idUser = ? AND ut.idTarea = ?", [userId, taskId],
                                                                        function(err, rows) {
                                                                            if(err) {
                                                                                connection.release();
                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                            }
                                                                            else{
                                                                                if(rows.length == 0){
                                                                                    // No la tiene asignada, se la asignamos
                                                                                    connection.query("INSERT INTO aw_tareas_user_tareas VALUES (?,?,?);", [userId, taskId, task.done],
                                                                                        function(err, res) {
                                                                                            connection.release();
                                                                                            if(err) {
                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                            }
                                                                                            else{
                                                                                                if(res.affectedRows == 0) {
                                                                                                    callback(new Error("Error al intentar insertar valores"));
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                                else{
                                                                    // Aunque tienen el mismo nombre no tienen las mismas etiquetas, así que no son la misma tarea, por lo que insertamos una nueva.
                                                                    connection.query("INSERT INTO aw_tareas_tareas VALUES(NULL,?)", [task.text],
                                                                        function(err, res) {
                                                                            if(err) {
                                                                                connection.release();
                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                            }
                                                                            else{
                                                                                if(res.affectedRows == 0){
                                                                                    connection.release();
                                                                                    callback(new Error("Error al intentar insertar valores"));
                                                                                }
                                                                                else {
                                                                                    // Obtenemos todas las etiquetas y comprobamos cuales no están en la BD para insertarlas
                                                                                    const taskId = res.insertId;
                                                                                    connection.query("SELECT * FROM aw_tareas_etiquetas;", [],
                                                                                        function(err, rows) {
                                                                                            if(err) {
                                                                                                connection.release();
                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                            }
                                                                                            else{
                                                                                                const tags = task.tags.reduce( (ac,t) => ac.indexOf(t) == -1 ? [...ac,t] : ac , []); // lista de etiquetas sin repetir
                                                                                                const tagsIds = tags.map( t => rows.reduce( (ac,r) => r.texto.toLowerCase() === t.toLowerCase() ? r.idEtiqueta : ac , -1) );
                                                                                                if(tagsIds.indexOf(-1) != -1 ) {
                                                                                                    // Hay que insertar etiquetas nuevas
                                                                                                    let query = tagsIds.reduce( (ac,id,i) => id != -1 ? ac : ac + `('${tags[i]}'), ` , "INSERT INTO aw_tareas_etiquetas (texto) VALUES ");
                                                                                                    query = query.substring(0,query.length-2);
                                                                                                    connection.query(query, [],
                                                                                                        function(err, res) {
                                                                                                            if(err) {
                                                                                                                connection.release();
                                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                                            }
                                                                                                            else{
                                                                                                                if(res.affectedRows == 0){
                                                                                                                    connection.release();
                                                                                                                    callback(new Error("Error al intentar insertar valores"));
                                                                                                                }
                                                                                                                else {
                                                                                                                    // Ahora están todas las etiquetas en la BD, recuperamos sus identificadores
                                                                                                                    connection.query("SELECT * FROM aw_tareas_etiquetas;", [],
                                                                                                                        function(err, rows) {
                                                                                                                            if(err) {
                                                                                                                                connection.release();
                                                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                                                            }
                                                                                                                            else{
                                                                                                                                // Insertamos los identificadores en la tabla de relacion "aw_tareas_tareas_etiquetas"
                                                                                                                                const allTagsIds = tags.map( t => rows.reduce( (ac,r) => r.texto.toLowerCase() === t.toLowerCase() ? r.idEtiqueta : ac , -1) );
                                                                                                                                let query = allTagsIds.reduce( (ac,id) => ac + `(${taskId},${id}), ` , "INSERT INTO aw_tareas_tareas_etiquetas (idTarea, idEtiqueta) VALUES ");
                                                                                                                                query = query.substring(0,query.length-2);
                                                                                                                                connection.query(query, [],
                                                                                                                                    function(err, res) {
                                                                                                                                        if(err) {
                                                                                                                                            connection.release();
                                                                                                                                            callback(new Error("Error de acceso a la base de datos"));
                                                                                                                                        }
                                                                                                                                        else{
                                                                                                                                            if(res.affectedRows == 0){
                                                                                                                                                connection.release();
                                                                                                                                                callback(new Error("Error al intentar insertar valores"));
                                                                                                                                            }
                                                                                                                                            else {
                                                                                                                                                // Asignamos la tarea al usuario
                                                                                                                                                connection.query("INSERT INTO aw_tareas_user_tareas VALUES (?, ?, ?)", [userId, taskId, task.done],
                                                                                                                                                    function(err, res) {
                                                                                                                                                        connection.release();
                                                                                                                                                        if(err) {
                                                                                                                                                            callback(new Error("Error de acceso a la base de datos"));
                                                                                                                                                        }
                                                                                                                                                        else{
                                                                                                                                                            if(res.affectedRows == 0){
                                                                                                                                                                callback(new Error("Error al intentar insertar valores"));
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                );
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                );
                                                                                                                            }
                                                                                                                        }
                                                                                                                    );
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                                else {
                                                                                                    // No hay que insertar etiquetas nuevas
                                                                                                    // Insertamos los identificadores en la tabla de relacion "aw_tareas_tareas_etiquetas"
                                                                                                    let query = tagsIds.reduce( (ac,id) => ac + `(${taskId},${id}), ` , "INSERT INTO aw_tareas_tareas_etiquetas (idTarea, idEtiqueta) VALUES ");
                                                                                                    query = query.substring(0,query.length-2);
                                                                                                    connection.query(query, [],
                                                                                                        function(err, res) {
                                                                                                            if(err) {
                                                                                                                connection.release();
                                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                                            }
                                                                                                            else{
                                                                                                                if(res.affectedRows == 0){
                                                                                                                    connection.release();
                                                                                                                    callback(new Error("Error al intentar insertar valores"));
                                                                                                                }
                                                                                                                else {
                                                                                                                    // Asignamos la tarea al usuario
                                                                                                                    connection.query("INSERT INTO aw_tareas_user_tareas VALUES (?, ?, ?)", [userId, taskId, task.done],
                                                                                                                        function(err, res) {
                                                                                                                            connection.release();
                                                                                                                            if(err) {
                                                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                                                            }
                                                                                                                            else{
                                                                                                                                if(res.affectedRows == 0){
                                                                                                                                    callback(new Error("Error al intentar insertar valores"));
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    );
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    );
                }
            }
        );
    }
    // NOTA: Se han incluido los siguientes errores:
    // "Error. No hay ningún usuario en la base de datos con el email indicado"
    // "Error. Se ha encontrado más de 1 usuario con el email indicado"
    // "Error al intentar insertar valores"
    // NOTA: Ejemplo de consulta para verificar la inserción:
    // SELECT u.idUser, u.email, t.idTarea, t.texto, ut.hecho, e.idEtiqueta, e.texto FROM aw_tareas_usuarios u JOIN aw_tareas_user_tareas ut ON u.idUser = ut.idUser JOIN aw_tareas_tareas t ON ut.idTarea = t.idTarea JOIN aw_tareas_tareas_etiquetas te ON t.idTarea = te.idTarea JOIN aw_tareas_etiquetas e ON te.idEtiqueta = e.idEtiqueta WHERE u.email = 'bill.puertas@ucm.es'; 

    /**
     * Marca la tarea 'idTask' como realizada actualizando en la base de datos la columna 'hecho' a 'true'.
     * @param idTask Identificador de la tarea que se quiere modificar. Valor que ha de coincidir con el del campo 'idTarea' de la tabla aw_tareas_tareas' de la BD.
     * @param callback Función de callback que gestiona los casos de error. Parámetros de entrada: (Error err).
     * Ejecuta la consulta: "UPDATE aw_tareas_user_tareas ut SET ut.hecho = 1 WHERE ut.idTarea = $idTask".
     */
    markTaskDone(idTask, callback) {
        this.pool.getConnection(
            function(err, connection) {
                if(err) {
                    callback(new Error("Error de conexión a la base de datos"));
                }
                else {
                    connection.query("UPDATE aw_tareas_user_tareas ut SET ut.hecho = 1 WHERE ut.idTarea = ?", [idTask],
                        function(err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if(err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                        }
                    );
                }
            }
        );
    }
    // NOTA: El campo 'hecho' pertenece a un tabla de relación entre el usuario y la tarea, por lo que este método la marcará como hecha para todos los usuarios que tengan esa tarea.

    /**
     * Marca la tarea 'idTask' del usuario que tenga el 'email' indicado como realizada actualizando en la base de datos la columna 'done' a 'true'.
     * @param email Email del usuario. Valor que ha de coincidir con el del campo 'email' de la tabla 'aw_tareas_usuarios' de la BD.
     * @param idTask Identificador de la tarea que se quiere modificar. Valor que ha de coincidir con el del campo 'idTarea' de la tabla aw_tareas_tareas' de la BD.
     * @param callback Función de callback que gestiona los casos de error. Parámetros de entrada: (Error err).
     * Ejecuta la consulta: "UPDATE aw_tareas_usuarios u JOIN aw_tareas_user_tareas ut ON u.idUser = ut.idUser SET ut.hecho = 1 WHERE u.email = $email AND ut.idTarea = $idTask".
     */
     markUserTaskDone(email, idTask, callback) {
        this.pool.getConnection(
            function(err, connection) {
                if(err) {
                    callback(new Error("Error de conexión a la base de datos"));
                }
                else {
                    connection.query("UPDATE aw_tareas_usuarios u JOIN aw_tareas_user_tareas ut ON u.idUser = ut.idUser SET ut.hecho = 1 WHERE u.email = ? AND ut.idTarea = ?", [email,idTask],
                        function(err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if(err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                        }
                    );
                }
            }
        )
    }
    // NOTA: Este método no se pide en la práctica.

    /**
     * Elimina todas las tareas asociadas al usuario cuyo correo es 'email' y que tengan el valor 'true' en la columna 'done'.
     * @param email Email del usuario. Valor que ha de coincidir con el del campo 'email' de la tabla 'aw_tareas_usuarios' de la BD.
     * @param callback Función de callback que gestiona los casos de error. Parámetros de entrada: (Error err).
     */
     deleteCompleted(email, callback) {
        this.pool.getConnection(
            function(err, connection) {
                if(err) {
                    callback(new Error("Error de conexión a la base de datos"));
                }
                else {
                    // Obtener datos de usuarios y tareas
                    connection.query("SELECT u.idUser, u.email, t.idTarea, t.texto, ut.hecho FROM aw_tareas_usuarios u JOIN aw_tareas_user_tareas ut ON u.idUser = ut.idUser JOIN aw_tareas_tareas t ON ut.idTarea = t.idTarea", [],
                        function(err,allUsersTasks) { 
                            if(err) {
                                connection.release();
                                callback(new Error("Error de acceso a la base de datos"));
                            } else {
                                const userDoneTasks = allUsersTasks.filter( r => r.email === email && r.hecho === 1);
                                if(userDoneTasks.length == 0){
                                    connection.release();
                                    callback(new Error("No se han encontrado tareas hechas para el usuario indicado"));
                                }
                                else {
                                    // Eliminar las tareas hechas para el usuario indicado en la relacion Usuario-Tareas
                                    const idUser = userDoneTasks[0].idUser;
                                    let query = userDoneTasks.reduce( (ac,r) => ac + `idTarea = ${r.idTarea} OR ` , `DELETE FROM aw_tareas_user_tareas WHERE idUser = ${idUser} AND (`);
                                    query = query.substring(0,query.length-4)+")";
                                    connection.query(query, [], 
                                        function(err, res) {
                                            if(err) {
                                                connection.release();
                                                callback(new Error("Error de acceso a la base de datos"));
                                            }
                                            else{
                                                if(res.affectedRows == 0){
                                                    connection.release();
                                                    callback(new Error("Error al intentar eliminar filas (de la tabla Usuario-Tareas)"));
                                                }
                                                else {
                                                    // Comprobar si hay que borrar también la tarea (si solo la tenia ese usuario)
                                                    const remainderTasks = allUsersTasks.filter( r => ! (r.email === email && r.hecho === 1) );
                                                    const delTaskIds = userDoneTasks.filter( r => ! remainderTasks.some( s => s.idTarea === r.idTarea ) ).map( r => r.idTarea );
                                                    if(delTaskIds.length != 0) {
                                                        // Si las hay, obtener datos de todas las tareas y sus etiquetas
                                                        connection.query("SELECT t.idTarea, t.texto, e.idEtiqueta, e.texto FROM aw_tareas_tareas t JOIN aw_tareas_tareas_etiquetas te ON t.idTarea = te.idTarea JOIN aw_tareas_etiquetas e ON te.idEtiqueta = e.idEtiqueta; ", [],
                                                            function(err,allTasks) { 
                                                                if(err) {
                                                                    connection.release();
                                                                    callback(new Error("Error de acceso a la base de datos"));
                                                                } else {
                                                                    // Obtener etiquetas de las tareas a borrar
                                                                    const delTaskTags = allTasks.filter( r => delTaskIds.some( id => r.idTarea === id ) );
                                                                    // Borrar las filas de las tareas a borrar en la relacion Tareas-Etiquetas
                                                                    let queryWhere = delTaskTags.map( r => r.idTarea ).reduce( (ac,id) => ac.indexOf(id) == -1 ? [...ac,id] : ac , []).reduce( (ac,id) => ac + `${id},` , "WHERE idTarea IN (");
                                                                    queryWhere = queryWhere.substring(0,queryWhere.length-1)+")";
                                                                    query = "DELETE FROM aw_tareas_tareas_etiquetas " + queryWhere;
                                                                    connection.query(query, [], 
                                                                        function(err, res) {
                                                                            if(err) {
                                                                                connection.release();
                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                            }
                                                                            else{
                                                                                if(res.affectedRows == 0){
                                                                                    connection.release();
                                                                                    callback(new Error("Error al intentar eliminar filas (de la tabla Tareas-Etiquetas)"));
                                                                                }
                                                                                else {
                                                                                    // Eliminar las tareas a borrar en la tabla de Tareas
                                                                                    query = "DELETE FROM aw_tareas_tareas " + queryWhere;
                                                                                    connection.query(query, [], 
                                                                                        function(err, res) {
                                                                                            if(err) {
                                                                                                connection.release();
                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                            }
                                                                                            else{
                                                                                                if(res.affectedRows == 0){
                                                                                                    connection.release();
                                                                                                    callback(new Error("Error al intentar eliminar filas (de la tabla Tareas)"));
                                                                                                }
                                                                                                else {
                                                                                                    // Comprobar si alguna otra tarea utiliza alguna de las etiquetas de las tareas borradas (en cuyo caso no ha de ser eliminada)
                                                                                                    const remainderTasks = allTasks.filter( r => ! delTaskIds.some( id => r.idTarea === id ) );
                                                                                                    const deltags = delTaskTags.filter( r => ! remainderTasks.some( s => s.idEtiqueta === r.idEtiqueta ) );
                                                                                                    query = deltags.reduce( (ac,r) => ac + `${r.idEtiqueta},` , "DELETE FROM aw_tareas_etiquetas WHERE idEtiqueta IN (");
                                                                                                    query = query.substring(0,query.length-1)+")";
                                                                                                    connection.query(query, [], 
                                                                                                        function(err, res) {
                                                                                                            connection.release();
                                                                                                            if(err) {
                                                                                                                callback(new Error("Error de acceso a la base de datos"));
                                                                                                            }
                                                                                                            else{
                                                                                                                if(res.affectedRows == 0){
                                                                                                                    callback(new Error("Error al intentar eliminar filas (de la tabla Etiquetas)"));
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            }
                                        }                                 
                                    );
                                }
                            }
                        }
                    );
                }
            }
        );
    }
    // NOTA: Se han incluido los siguientes errores:
    // "No se han encontrado tareas hechas para el usuario indicado"
    // "Error al intentar eliminar filas"

}

module.exports = DAOTasks;