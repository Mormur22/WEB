
CREATE TABLE aw_tareas_usuarios (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(250) NOT NULL,
  `img` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) 

CREATE TABLE `aw_tareas_tareas` (
  `idTarea` int NOT NULL AUTO_INCREMENT,
  `texto` varchar(45) NOT NULL,
  PRIMARY KEY (`idTarea`)
);

CREATE TABLE `aw_tareas_user_tareas` (
 
    `idTarea` int NOT NULL,
    idUser int NOT NULL,

  PRIMARY KEY (`idUser`,`idTarea`),
  KEY `fk_tareatarea_idx` (`idTarea`),
  CONSTRAINT `fk_tareatarea` FOREIGN KEY (`idTarea`) REFERENCES `aw_tareas_tareas` (`idTarea`) ON DELETE CASCADE ON UPDATE CASCADE
 KEY `fk_tareuser_idx` (`idUser`),
  CONSTRAINT `fk_tareauser` FOREIGN KEY (`idUser`) REFERENCES `aw_tareas_usuarios` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

CREATE TABLE `aw_tareas_etiquetas` (

  `idEtiqueta` int NOT NULL AUTO_INCREMENT,
  texto varchar(255),
  PRIMARY KEY (`idEtiqueta`),
);

CREATE TABLE `aw_tareas_tareas_etiquetas` (
  `idTarea` int NOT NULL,
  `idEtiqueta` int NOT NULL,
  primary key (`idTarea`,`idEtiqueta`),
   KEY `fk_tareas_tareas_etiquetas_tarea` (`idTarea`),
  CONSTRAINT `fk_tareas_tareas_etiquetas_tarea` FOREIGN KEY (`idTarea`) REFERENCES `aw_tareas_tareas` (`idTarea`) ON DELETE CASCADE ON UPDATE CASCADE
 KEY `fk_tareas_tareas_etiqueta_etiqueta` (`idEtiqueta`),
  CONSTRAINT `fk_tareas_tareas_etiqueta_etiqueta` FOREIGN KEY (`idEtiqueta`) REFERENCES `aw_tareas_etiquetas` (`idEtiqueta`) ON DELETE CASCADE ON UPDATE CASCADE

)