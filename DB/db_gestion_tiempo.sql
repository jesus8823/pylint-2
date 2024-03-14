Create TABLE metas(
	id INT PRIMARY KEY,
	titulo TEXT,
	descripcion TEXT,
	fecha_registro TIMESTAMP,
	fecha_inicio TIMESTAMP,
	fecha_cumplimiento TIMESTAMP,
	fecha_fin TIMESTAMP
);
CREATE SEQUENCE metas_secuencia;
ALTER TABLE metas ALTER COLUMN id SET DEFAULT NEXTVAL('metas_secuencia');

CREATE TABLE objetivos(
	id INT PRIMARY KEY,
	titulo TEXT,
	descripcion TEXT,
	meta INT REFERENCES metas(id),
	fecha_registro TIMESTAMP,
	fecha_inicio TIMESTAMP,
	fecha_cumplimiento TIMESTAMP,
	fecha_fin TIMESTAMP
);
CREATE SEQUENCE objetivos_secuencia;
ALTER TABLE objetivos ALTER COLUMN id SET DEFAULT NEXTVAL('objetivos_secuencia');

CREATE Table tareas(
	id INT PRIMARY KEY,
	titulo TEXT,
	descripcion TEXT,
	meta INT REFERENCES metas(id),
	objetivos INT REFERENCES objetivos(id),
	fecha_registro TIMESTAMP,
	fecha_inicio TIMESTAMP,
	fecha_cumplimiento TIMESTAMP,
	fecha_fin TIMESTAMP
);
CREATE SEQUENCE tareas_secuencia;
ALTER TABLE tareas ALTER COLUMN id SET DEFAULT NEXTVAL('tareas_secuencia');





















CREATE TABLE objetivos_generales(
	id INT PRIMARY KEY,
	Objetivo TEXT,
	posicion INT,
	fecha_fin timestamp

);

CREATE SEQUENCE objetivos_generales_secuencia;
ALTER TABLE objetivos_generales ALTER COLUMN id SET DEFAULT NEXTVAL('objetivos_generales_secuencia');


CREATE TABLE objetivos_individuales(
	id INT PRIMARY KEY,
	objetivo_general INT REFERENCES objetivos_generales(id),
	objetivo TEXT,
	descripcion TEXT,
	posicion INT,
	fecha_inicio timestamp DEFAULT now(),
	fecha_fin timestamp
);

CREATE SEQUENCE objetivos_individuales_secuencia;
ALTER TABLE objetivos_individuales ALTER COLUMN id SET DEFAULT NEXTVAL('objetivos_individuales_secuencia');

CREATE TABLE actividad_objetivos (
	id INT PRIMARY KEY,
	descripcion TEXT,
	objetivos_individuales INT REFERENCES objetivos_individuales(id),
	fecha_inicio timestamp DEFAULT now(),
	fecha_fin timestamp
);

CREATE SEQUENCE actividad_objetivos_secuencia;
ALTER TABLE actividad_objetivos ALTER COLUMN id SET DEFAULT NEXTVAL('actividad_objetivos_secuencia');

CREATE TABLE actividad_general (
	id INT PRIMARY KEY,
	descripcion TEXT,
	tipo_tarea TEXT,
	objetivos_individuales INT REFERENCES objetivos_individuales(id),
	fecha_inicio timestamp DEFAULT now(),
	fecha_fin timestamp
);

CREATE SEQUENCE actividad_general_secuencia;
ALTER TABLE actividad_general ALTER COLUMN id SET DEFAULT NEXTVAL('actividad_general_secuencia');

CREATE TABLE alimentarse (
	id INT PRIMARY KEY,
	alimentarse TEXT,
	descripcion TEXT,
	fecha_inicio timestamp DEFAULT now(),
	fecha_fin timestamp
);

CREATE SEQUENCE alimentarse_secuencia;
ALTER TABLE alimentarse ALTER COLUMN id SET DEFAULT NEXTVAL('alimentarse_secuencia');

CREATE TABLE dormir (
	id INT PRIMARY KEY,
	descripcion TEXT,
	fecha_inicio timestamp DEFAULT now(),
	fecha_fin timestamp
);

CREATE SEQUENCE dormir_secuencia;
ALTER TABLE dormir ALTER COLUMN id SET DEFAULT NEXTVAL('dormir_secuencia');

CREATE TABLE necesidades (
	id INT PRIMARY KEY,
	descripcion TEXT,
	fecha_inicio timestamp DEFAULT now(),
	fecha_fin timestamp
);

CREATE SEQUENCE necesidades_secuencia;
ALTER TABLE necesidades ALTER COLUMN id SET DEFAULT NEXTVAL('necesidades_secuencia');

CREATE TABLE notas (
	id INT PRIMARY KEY,
	descripcion TEXT,
	fecha DATE
);

CREATE SEQUENCE notas_secuencia;
ALTER TABLE notas ALTER COLUMN id SET DEFAULT NEXTVAL('notas_secuencia');



