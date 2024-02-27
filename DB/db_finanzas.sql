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





