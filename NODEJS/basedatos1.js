
const mysql = require("mysql");
const pool = mysql.createPool ({ host: "localhost",
                                user: "root",
                                password: "",
                                database: "miBD" });

// Suponemos que la variable `id` contiene el identificador
// introducido por el usuario
pool.getConnection(function(err, connection) {
    if (err) {
        console.log(`Error al obtener la conexión: ${err.message}`);
    }
    else {
        const sql=`SELECT Nombre, Apellidos FROM Contactos WHERE Id=${id}
        connection.query(sql, function(err, filas) {
        connection.release();
        if (err) {
            console.log("Error en la consulta");
        } else {
            console.log(filas);
        }
    }
});