const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/finanzas",async (req,res)=>{
	const ac_registro_finanzas = await pool.query(`SELECT 
									ac_registro_finanzas.id AS finanzas_id,
									ac_registro_finanzas.descripcion,
									ac_registro_finanzas.etiqueta AS etiqueta_id,
									ac_registro_finanzas.banco AS banco_id,
									ac_registro_finanzas.dinero,
									ac_registro_finanzas.finanzas_tipo_dinero AS tipo_dinero_id,
									ac_registro_finanzas.posicion,
								

									finanzas_etiquetas.id AS etiquetas_ids,
									finanzas_etiquetas.nombre AS etiquetas_nombre,

									finanzas_bancos.id AS bancos_ids,
									finanzas_bancos.nombre AS bancos_nombre,
									
									finanzas_tipo_dinero.id AS tipo_dinero_ids,
									finanzas_tipo_dinero.nombre AS tipo_dinero_nombre,
									finanzas_tipo_dinero.simbolo AS tipo_dinero_simbolo,
									finanzas_tipo_dinero.color AS tipo_dinero_color

									FROM ac_registro_finanzas
									RIGHT JOIN finanzas_etiquetas ON ac_registro_finanzas.etiqueta = finanzas_etiquetas.id
									RIGHT JOIN finanzas_bancos ON ac_registro_finanzas.banco = finanzas_bancos.id
									RIGHT JOIN finanzas_tipo_dinero ON ac_registro_finanzas.finanzas_tipo_dinero = finanzas_tipo_dinero.id

									  ORDER BY posicion ASC, descripcion ASC;`);
	const Ac_registro_finanzas = ac_registro_finanzas.rows;



	res.render("./acceso_rapido/finanzas/index",{Ac_registro_finanzas})
});

router.get("/finanzas/add_registros",async (req,res)=>{
	const etiquetas = await pool.query(`SELECT*FROM finanzas_etiquetas ORDER BY posicion ASC`);
	const Etiquetas = etiquetas.rows;

	const bancos = await pool.query(`SELECT*FROM finanzas_bancos ORDER BY posicion ASC`);
	const Bancos = bancos.rows;

	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC`);
	const Tipo_Dinero = tipo_dinero.rows;

	const control_dinero = await pool.query(`SELECT*FROM finanzas_control_dinero ORDER BY fecha_inicio ASC`);
	const Control_Dinero = control_dinero.rows;

	const lista_gastos = await pool.query(`SELECT*FROM finanzas_lista_compras ORDER BY fecha_estimada_inicio ASC`);
	const Lista_Gastos = lista_gastos.rows;
	res.render("./acceso_rapido/finanzas/add_registros.hbs",{Etiquetas, Bancos, Tipo_Dinero, Control_Dinero,Lista_Gastos})
});

router.post("/finanzas/add_registros",async (req,res)=>{
	const {
		descripcion_registros,

		id_etiqueta_registros,
		etiqueta_registros,

		monto,

		id_tipo_monto_registros,
		tipo_monto_registros,

		id_banco_registros,
		banco_registros,

		id_control_registros,
		control_registros,

		id_lista_registros,
		lista_registros,

		posicion

	} = req.body;
	const datos = {
		descripcion_registros,
		id_etiqueta_registros,
		id_banco_registros,
		id_control_registros,
		id_lista_registros,
		monto,
		id_tipo_monto_registros,
		posicion

	}


	if (datos.id_control_registros == ""){
		datos.id_control_registros = null;
	}
	if (datos.id_lista_registros == ""){
		datos.id_lista_registros = null;
	}

	await pool.query(`INSERT INTO ac_registro_finanzas (
		id,
		descripcion,
		etiqueta,
		banco,
		control_dinero,
		finanzas_lista_compras,
		dinero,
		finanzas_tipo_dinero,
		posicion)

		VALUES
		(DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8)`,[...Object.values(datos)])

	res.redirect("/acceso_rapido/finanzas");
});



router.get("/finanzas/edit_registros/:id",async (req,res)=>{
	const {id} = req.params;

	// ac_registro_finanzas.control_dinero_id,
	// ac_registro_finanzas.finanzas_lista_compras_id,
	const datos = await pool.query(`SELECT 
									ac_registro_finanzas.id AS finanzas_id,
									ac_registro_finanzas.descripcion,
									ac_registro_finanzas.etiqueta AS etiqueta_id,
									ac_registro_finanzas.banco AS banco_id,
									ac_registro_finanzas.dinero,
									ac_registro_finanzas.finanzas_tipo_dinero AS tipo_dinero_id,
									ac_registro_finanzas.posicion,
									
								

									finanzas_etiquetas.id AS etiquetas_ids,
									finanzas_etiquetas.nombre AS etiquetas_nombre,

									finanzas_bancos.id AS bancos_ids,
									finanzas_bancos.nombre AS bancos_nombre,
									
									finanzas_tipo_dinero.id AS tipo_dinero_ids,
									finanzas_tipo_dinero.nombre AS tipo_dinero_nombre,
									finanzas_tipo_dinero.simbolo AS tipo_dinero_simbolo,
									finanzas_tipo_dinero.color AS tipo_dinero_color




									FROM ac_registro_finanzas
									RIGHT JOIN finanzas_etiquetas ON ac_registro_finanzas.etiqueta = finanzas_etiquetas.id
									RIGHT JOIN finanzas_bancos ON ac_registro_finanzas.banco = finanzas_bancos.id
									RIGHT JOIN finanzas_tipo_dinero ON ac_registro_finanzas.finanzas_tipo_dinero = finanzas_tipo_dinero.id
									WHERE ac_registro_finanzas.id = $1
									ORDER BY posicion ASC, descripcion ASC;`,[id]);
	const Datos = datos.rows[0];
	console.log(Datos)

	const etiquetas = await pool.query(`SELECT*FROM finanzas_etiquetas ORDER BY posicion ASC`);
	const Etiquetas = etiquetas.rows;

	const bancos = await pool.query(`SELECT*FROM finanzas_bancos ORDER BY posicion ASC`);
	const Bancos = bancos.rows;

	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC`);
	const Tipo_Dinero = tipo_dinero.rows;

	const control_dinero = await pool.query(`SELECT*FROM finanzas_control_dinero ORDER BY fecha_inicio ASC`);
	const Control_Dinero = control_dinero.rows;

	const lista_gastos = await pool.query(`SELECT*FROM finanzas_lista_compras ORDER BY fecha_estimada_inicio ASC`);
	const Lista_Gastos = lista_gastos.rows;
	res.render("./acceso_rapido/finanzas/edit_registros.hbs",{Etiquetas, Bancos, Tipo_Dinero, Control_Dinero,Lista_Gastos, Datos});
});

router.post("/finanzas/edit_registros/:id",async (req,res)=>{
	const {
		descripcion_registros,

		id_etiqueta_registros,
		etiqueta_registros,

		monto,

		id_tipo_monto_registros,
		tipo_monto_registros,

		id_banco_registros,
		banco_registros,

		id_control_registros,
		control_registros,

		id_lista_registros,
		lista_registros,

		posicion

	} = req.body;
	const datos = {
		descripcion_registros,
		id_etiqueta_registros,
		id_banco_registros,
		id_control_registros,
		id_lista_registros,
		monto,
		id_tipo_monto_registros,
		posicion

	}


	if (datos.id_control_registros == ""){
		datos.id_control_registros = null;
	}
	if (datos.id_lista_registros == ""){
		datos.id_lista_registros = null;
	}

	await pool.query(`INSERT INTO ac_registro_finanzas (
		id,
		descripcion,
		etiqueta,
		banco,
		control_dinero,
		finanzas_lista_compras,
		dinero,
		finanzas_tipo_dinero,
		posicion)

		VALUES
		(DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8)`,[...Object.values(datos)])

	res.redirect("/acceso_rapido/finanzas");
});



router.post("/finanzas/insertar_registros/:id",async (req,res)=>{
	const {id} = req.params;

	const {descripcion,dinero} = req.body;


	const datos = await pool.query(`SELECT*FROM ac_registro_finanzas WHERE id = $1`,[id]);
	const Datos = datos.rows[0];


	const Datos_Ordenados = {
		descripcion:descripcion,
		etiqueta: Datos.etiqueta,
		banco: Datos.banco,
		control_dinero:Datos.control_dinero,
		finanzas_lista_compras: Datos.finanzas_lista_compras,
		dinero: dinero,
		finanzas_tipo_dinero: Datos.finanzas_tipo_dinero,
		dinero_actual:0
	}

	await pool.query(`INSERT INTO finanzas (
		id,
		descripcion,
		etiqueta,
		banco,
		control_dinero,
		finanzas_lista_compras,
		dinero,
		finanzas_tipo_dinero,
		dinero_actual,
		fecha)

		VALUES
		(DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8,now())`,[...Object.values(Datos_Ordenados)])
	 res.redirect("/finanzas/registros/calcular_dinero");
});

router.get("/finanzas/borrar_registros/:id", async (req,res)=>{
	const {id} = req.params;
	await pool.query(`DELETE FROM ac_registro_finanzas WHERE id = $1;`,[id])
	res.redirect("/acceso_rapido/finanzas");
});

module.exports = router;