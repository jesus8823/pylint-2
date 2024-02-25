INSERT INTO objetivos_generales (id,objetivo,fecha_fin) VALUES (DEFAULT,'Objetivo 1','2008/12/31 13:00:00.59'); 
INSERT INTO objetivos_generales (id,objetivo,fecha_fin) VALUES (DEFAULT,'Objetivo 2','2008/12/31 13:00:00.59'); 
INSERT INTO objetivos_generales (id,objetivo,fecha_fin) VALUES (DEFAULT,'Objetivo 3','2008/12/31 13:00:00.59'); 
INSERT INTO objetivos_generales (id,objetivo,fecha_fin) VALUES (DEFAULT,'Objetivo 4','2008/12/31 13:00:00.59'); 

INSERT INTO objetivos_individuales (id,objetivo_general,objetivo,descripcion,fecha_inicio,fecha_fin) VALUES (DEFAULT,1,'hacer tarea 1','hacer tarea del hogar',DEFAULT,'2008/12/31 13:00:00.59'); 
INSERT INTO objetivos_individuales (id,objetivo_general,objetivo,descripcion,fecha_inicio,fecha_fin) VALUES (DEFAULT,2,'hacer tarea 2','hacer tarea del trabajo',DEFAULT,'2008/12/31 13:00:00.59'); 
INSERT INTO objetivos_individuales (id,objetivo_general,objetivo,descripcion,fecha_inicio,fecha_fin) VALUES (DEFAULT,2,'hacer tarea 3','hacer tarea del amor',DEFAULT,'2008/12/31 13:00:00.59'); 
INSERT INTO objetivos_individuales (id,objetivo_general,objetivo,descripcion,fecha_inicio,fecha_fin) VALUES (DEFAULT,3,'hacer tarea 4','hacer tarea del ducha',DEFAULT,'2008/12/31 13:00:00.59'); 

ALTER TABLE objetivos_generales ADD COLUMN posicion INT;

INSERT INTO actividad_general (id , descripcion , tipo_tarea , objetivo_general , objetivos_individuales , fecha_inicio , fecha_fin)
VALUES (DEFAULT,'hacer tarea 1' ,'Objetivo',1,1,NULL,NULL);
INSERT INTO actividad_general (id , descripcion , tipo_tarea , objetivo_general , objetivos_individuales , fecha_inicio , fecha_fin)
VALUES (DEFAULT,'hacer tarea 2' ,'Objetivo',1,1,DEFAULT,NULL);

INSERT INTO actividad_general (id , descripcion , tipo_tarea , objetivo_general , objetivos_individuales , fecha_inicio , fecha_fin)
VALUES (DEFAULT,'tarea echa' ,'Objetivo',1,1,DEFAULT,now());



SELECT fecha_inicio::date AS date, fecha_inicio::time AS time FROM actividad_general;
SELECT fecha_inicio::date AS date, TO_CHAR(fecha_inicio, 'HH24:MI') AS time FROM actividad_general;

SELECT fecha_inicio::date AS date, TO_CHAR(fecha_inicio, 'HH12:MI AM') AS time FROM actividad_ge
neral;

SELECT TO_CHAR(fecha_inicio, 'DD/MM/YYYY') AS date, TO_CHAR(fecha_inicio, 'HH12:MI AM') AS time FROM actividad_objetivos;

SELECT id,objetivo_general,objetivos_individuales,descripcion,
TO_CHAR(fecha_inicio, 'DD/MM/YYYY') AS date_inicio, TO_CHAR(fecha_inicio, 'HH12:MI AM') AS time_inicio,
TO_CHAR(fecha_fin, 'DD/MM/YYYY') AS date_fin, TO_CHAR(fecha_fin, 'HH12:MI AM') AS time_fin 
FROM actividad_general;

-- insertar db
psql -h localhost -p 5432 -U postgres -f db.sql pylint

ALTER TABLE nombre_tabla DROP CONSTRAINT nombre_constraint;

ALTER TABLE actividad_objetivos DROP COLUMN objetivo_general;



