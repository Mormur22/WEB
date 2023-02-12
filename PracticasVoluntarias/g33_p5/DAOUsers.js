"use strict";

/**
 * Clase que implementa la funcionalidad relacionada con la gestión de usuarios en la BD.
 */
class DAOUsers {

    /**
     * Constrictor de la clase 'DAOUsers'.
     * Crea un objeto con los métodos necesarios para realizar las operaciones de gestión de usuarios en la BD.
     * @param pool Pool de conexiones que se usará para conectarse a la BD.
     */
    constructor(pool) {
        this.pool = pool;
    }
    
    /**
     * comprueba si en la base de datos hay un usuario con el email y contraseña pasados como parámetros.
     * @param email Email del usuario. Valor que ha de coincidir con el del campo 'email' de la tabla 'aw_tareas_usuarios' de la BD.
     * @param password Contraseña del usuario. Valor que ha de coincidir con el del campo 'password' de la tabla 'aw_tareas_usuarios' de la BD.
     * @param callback Función de callback que gestiona los casos de error y éxito. Parámetros de entrada: (Error err, Boolean result).
     * Ejecuta la consulta "SELECT * FROM aw_tareas_usuarios WHERE email = $email AND password = $password".
     */
    isUserCorrect(email, password, callback) {
        this.pool.getConnection(
            function(err, connection) {
                if(err) {
                    callback(new Error("Error de conexión a la base de datos"));
                } else {
                    connection.query("SELECT * FROM aw_tareas_usuarios WHERE email = ? AND password = ?" , [email,password],
                        function(err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if(err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            } else {
                                if(rows.length === 0) {
                                    callback(new Error("Dirección de correo y/o contraseña no válidos"), false); // no existe el usuario con el email y password proporcionados
                                } else {
                                    callback(null, true);
                                }
                            }
                        }
                    );
                }
            }
        );
    }

    /**
     * Obtiene el nombre de fichero que contiene la imagen de perfil de un usuario cuyo email en la base de datos es pasado como parámetro.
     * @param email Email del usuario. Valor que ha de coincidir con el del campo 'email' de la tabla 'aw_tareas_usuarios' de la BD.
     * @param callback Función de callback que gestiona los casos de error y éxito. Parámetros de entrada: (Error err, String result).
     * Ejecuta la consulta: "SELECT img FROM aw_tareas_usuarios WHERE email = $email".
     */
    getUserImageName(email, callback) {
        this.pool.getConnection(
            function(err, connection) {
                if(err) {
                    callback(new Error("Error de conexión a la base de datos"));
                } else {
                    connection.query("SELECT img FROM aw_tareas_usuarios WHERE email = ?" , [email],
                        function(err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if(err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            } else {
                                if(rows.length === 0) {
                                    callback(null, null); // no existe el usuario con el email proporcionado
                                } else {
                                    callback(null, rows[0].img);
                                }
                            }
                        }
                    );
                }
            }
        );
    }

}

module.exports = DAOUsers;