CREATE TABLE clientes(
	id INTEGER PRIMARY KEY,
	nombre TEXT,
	rut TEXT
);

CREATE TABLE pedidos(
	id INTEGER,
	id_cliente INTEGER REFERENCES clientes(id),
	descripcion TEXT
);

INSERT INTO clientes (id, nombre, rut)
VALUES
	(1, 'Juan', '25.685.569'),
	(2, 'Pedro', '36.987.654'),
	(3, 'María', '14.567.890'),
	(4, 'Ana', '48.712.356'),
	(5, 'Luis', '39.875.432'),
	(6, 'Laura', '21.345.678'),
	(7, 'Carlos', '15.987.654'),
	(8, 'Sofía', '33.456.789'),
	(9, 'Diego', '29.876.543'),
	(10, 'Valeria', '18.765.432'),
	(11, 'Andrés', '24.567.890');


INSERT INTO pedidos (id, id_cliente, descripcion) 
VALUES 
  (1, 2, 'ropa,carne,pan,mortadela'),
  (2, 3, 'cerdo,carne,almohada,mortadela'),
  (3, 4, 'maicena,pañales,aceite,ropa'),
  (4, 5, 'pollo,carne,lechuga,tomate'),
  (5, 6, 'arroz,pasta,salsa,queso'),
  (6, 7, 'verduras,frutas,leche,yogur'),
  (7, 8, 'pan,mantequilla,huevos,jamón'),
  (8, 9, 'papas,frijoles,queso,cebolla'),
  (9, 10, 'azúcar,café,galletas,harina'),
  (10, 1, 'aceitunas,queso,tortillas,chorizo'),
  (11,null,'otro pedido'),
  (12,1,'otro pedido');
  
 SELECT*FROM clientes INNER JOIN pedidos ON clientes.id = pedidos.id_cliente;
 SELECT*FROM pedidos INNER JOIN clintes ON pedidos.id_cliente = clienets.id;