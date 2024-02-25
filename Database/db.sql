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




-- Finanzas

CREATE TABLE fecha_finanzas(
	id INT PRIMARY KEY,
	fecha_inicio DATE,
	fecha_fin DATE
);

CREATE TABLE finanzas_etiquetas(
	id INT PRIMARY KEY,
	nombre TEXT,
	posicion INT
);
CREATE SEQUENCE finanzas_etiquetas_secuencia;
ALTER TABLE finanzas_etiquetas ALTER COLUMN id SET DEFAULT NEXTVAL('finanzas_etiquetas_secuencia');


CREATE TABLE finanzas_bancos(
	id INT PRIMARY KEY,
	nombre TEXT,
	posicion INT
);
CREATE SEQUENCE finanzas_bancos_secuencia;
ALTER TABLE finanzas_bancos ALTER COLUMN id SET DEFAULT NEXTVAL('finanzas_bancos_secuencia');


CREATE TABLE finanzas_tipo_dinero(
	id INT PRIMARY KEY,
	nombre TEXT,
	simbolo TEXT,
	color TEXT,
	posicion INT
);
CREATE SEQUENCE finanzas_tipo_dinero_secuencia;
ALTER TABLE finanzas_tipo_dinero ALTER COLUMN id SET DEFAULT NEXTVAL('finanzas_tipo_dinero_secuencia');


CREATE TABLE control_finanzas(
	id INT PRIMARY KEY,
	titulo TEXT,
	fecha_inicio DATE,
	fecha_fin DATE
);
CREATE SEQUENCE control_finanzas_secuencia;
ALTER TABLE control_finanzas ALTER COLUMN id SET DEFAULT NEXTVAL('control_finanzas_secuencia');


CREATE TABLE enlases_control_etiquetas(
	id INT PRIMARY KEY,
	control_finanzas INT REFERENCES control_finanzas(id),
	etiqueta INT REFERENCES finanzas_etiquetas(id),
	etiqueta_sub INT REFERENCES finanzas_sub_etiquetas(id),
	dinero_total DECIMAL(200,16),
	dias_obtencion INT
);
CREATE SEQUENCE enlases_control_etiquetas_secuencia;
ALTER TABLE enlases_control_etiquetas ALTER COLUMN id SET DEFAULT NEXTVAL('enlases_control_etiquetas_secuencia');


CREATE TABLE trabajos(
	id INT PRIMARY KEY,
	nombre TEXT,
	fecha_inicio TIMESTAMP,
	fecha_fin TIMESTAMP
);
CREATE SEQUENCE trabajos_secuencia;
ALTER TABLE trabajos ALTER COLUMN id SET DEFAULT NEXTVAL('trabajos_secuencia');


CREATE TABLE etiquetas_trabajos(
	id INT PRIMARY KEY,
	nombre TEXT,
	descripcion TEXT,
	ingreso DECIMAL(200,16),
	finanzas_tipo_dinero INT REFERENCES finanzas_tipo_dinero(id),
	banco INT REFERENCES finanzas_bancos(id),
	trabajos_id INT REFERENCES trabajos(id)
);
CREATE SEQUENCE etiquetas_trabajos_secuencia;
ALTER TABLE etiquetas_trabajos ALTER COLUMN id SET DEFAULT NEXTVAL('etiquetas_trabajos_secuencia');


CREATE TABLE finanzas(
	id INT PRIMARY KEY,
	descripcion TEXT,
	etiquetas_gastos INT REFERENCES finanzas_etiquetas(id),
	banco INT REFERENCES finanzas_bancos(id),
	control_ingreso_egreso INT REFERENCES control_finanzas(id),
	trabajo INT REFERENCES trabajos(id),
	etiquetas_trabajos INT REFERENCES etiquetas_trabajos(id),
	dinero DECIMAL(200,16),
	finanzas_tipo_dinero INT REFERENCES finanzas_tipo_dinero(id),
	dinero_actual DECIMAL(200,16),
	dinero_banco DECIMAL(200,16),
	fecha TIMESTAMP
);
CREATE SEQUENCE finanzas_secuencia;
ALTER TABLE finanzas ALTER COLUMN id SET DEFAULT NEXTVAL('finanzas_secuencia');

-- Acceso Rapido

CREATE TABLE ac_registro_finanzas(
	id INT PRIMARY KEY,
	descripcion TEXT,
	etiqueta INT REFERENCES finanzas_etiquetas(id),
	banco INT REFERENCES finanzas_bancos(id),
	dinero DECIMAL(200,16),
	finanzas_tipo_dinero INT REFERENCES finanzas_tipo_dinero(id),
	posicion INT
);

CREATE SEQUENCE ac_registro_finanzas_secuencia;
ALTER TABLE ac_registro_finanzas ALTER COLUMN id SET DEFAULT NEXTVAL('ac_registro_finanzas_secuencia');



