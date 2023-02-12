'use strict';
const { resolve } = require("path");
class DAOTasks {


    constructor(pool){
        this.pool =pool;
    }

    getAllTasks(email, callback) {

        this.pool.getConnection(function(err, connection) {
            if (err) {
            callback(new Error("Error de conexión a la base de datos aaaa"));
            }
            else {
                connection.query("SELECT aw_tareas_user_tareas.idTarea, aw_tareas_tareas.texto as teareatexto, aw_tareas_user_tareas.hecho, aw_tareas_etiquetas.texto FROM aw_tareas_usuarios JOIN aw_tareas_user_tareas ON aw_tareas_usuarios.idUser = aw_tareas_user_tareas.idUser JOIN aw_tareas_tareas ON aw_tareas_user_tareas.idTarea = aw_tareas_tareas.idTarea JOIN aw_tareas_tareas_etiquetas ON aw_tareas_user_tareas.idTarea = aw_tareas_tareas_etiquetas.idTarea JOIN aw_tareas_etiquetas ON aw_tareas_tareas_etiquetas.idEtiqueta = aw_tareas_etiquetas.idEtiqueta WHERE email = ?",[email],
                    function(err, rows){
                    connection.release(); // devolver al pool la conexión
                        if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            }
                            else {
                                console.log(rows);
                                callback(null, true);
                            }
                        }
                    });
                }
            });
    }
    insertTask(email, task, callback) {}
    markTaskDone(idTask, callback) {}
    deleteCompleted(email, callback) {}
}
module.exports = DAOTasks;