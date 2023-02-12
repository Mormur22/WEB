CREATE DATABASE IF NOT EXISTS aw_tareas CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE aw_tareas;

DROP TABLE IF EXISTS aw_tareas_user_tareas;
DROP TABLE IF EXISTS aw_tareas_tareas_etiquetas;
DROP TABLE IF EXISTS aw_tareas_usuarios;
DROP TABLE IF EXISTS aw_tareas_tareas;
DROP TABLE IF EXISTS aw_tareas_etiquetas;

CREATE TABLE aw_tareas_usuarios (
  idUser INTEGER NOT NULL UNIQUE AUTO_INCREMENT,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  img VARCHAR(255),
  PRIMARY KEY (idUser)
);

CREATE TABLE aw_tareas_tareas (
  idTarea INTEGER NOT NULL UNIQUE AUTO_INCREMENT,
  texto VARCHAR(120) NOT NULL,
  PRIMARY KEY (idTarea)
);

CREATE TABLE aw_tareas_etiquetas (
  idEtiqueta INTEGER NOT NULL UNIQUE AUTO_INCREMENT,
  texto VARCHAR(30) NOT NULL UNIQUE,
  PRIMARY KEY (idEtiqueta)
);

CREATE TABLE aw_tareas_user_tareas (
  idUser INTEGER NOT NULL,
  idTarea INTEGER NOT NULL,
  hecho BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (idUser,idTarea),
  FOREIGN KEY (idUser) REFERENCES aw_tareas_usuarios (idUser),
  FOREIGN KEY (idTarea) REFERENCES aw_tareas_tareas (idTarea)
);

CREATE TABLE aw_tareas_tareas_etiquetas (
  idTarea INTEGER NOT NULL,
  idEtiqueta INTEGER NOT NULL,
  PRIMARY KEY (idTarea,idEtiqueta),
  FOREIGN KEY (idTarea) REFERENCES aw_tareas_tareas (idTarea),
  FOREIGN KEY (idEtiqueta) REFERENCES aw_tareas_etiquetas (idEtiqueta)
);

INSERT INTO aw_tareas_usuarios (email, password, img) VALUES
  ('aitor.tilla@ucm.es', 'aitor', 'leonardo.png'),
  ('felipe.lotas@ucm.es', 'felipe', null),
  ('steve.curros@ucm.es', 'steve', 'steve.jpg'),
  ('bill.puertas@ucm.es', 'bill', 'bill.jpg');

INSERT INTO aw_tareas_tareas (texto) VALUES
  ('Preparar prácticas AW'),
  ('Mirar fechas de congreso'),
  ('Ir al Supermercado'),
  ('Jugar al Fútbol'),
  ('Hablar con el profesor');

INSERT INTO aw_tareas_user_tareas (idUser, idTarea, hecho) VALUES
  (1,1,0),
  (1,2,1),
  (1,3,0),
  (1,4,0),
  (1,5,0),
  (2,3,0),
  (2,4,0),
  (2,5,0),
  (3,1,0),
  (3,2,0),
  (3,3,1),
  (3,4,0),
  (4,1,1),
  (4,2,0),
  (4,3,1),
  (4,4,0);

INSERT INTO aw_tareas_etiquetas (texto) VALUES
  ('Universidad'),
  ('AW'),
  ('TP'),
  ('Práctica'),
  ('Personal'),
  ('Académico'),
  ('Deporte'),
  ('Básico');

INSERT INTO aw_tareas_tareas_etiquetas (idTarea, idEtiqueta) VALUES
  (1,1),
  (1,2),
  (1,3),
  (2,6),
  (3,5),
  (3,6),
  (4,5),
  (4,7),
  (5,1),
  (5,3);
-- NOTA:
-- En el gión de la prática voluntaria 2, se indicaba que la tarea 3 ("Ir al Supermercado") tenía como etiquetas "Personal" (idEtiqueta = 5) y "Básico" (idEtiqueta = 8).
-- Sin embargo, en el guión de la practica voluntaria 3, se le añadido la etiqueta 6 ("Académico") dejando a la etiqueta 8 ("Básico") sin asignar a ninguna tarea.
