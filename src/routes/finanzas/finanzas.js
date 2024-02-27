const express = require("express");
const router = express.Router();
const XlsxPopulate = require('xlsx-populate');
const path = require("path");

const pool = require("../../database");


router.get("/",async (req,res)=>{
	res.render("./finanzas/index")
});




													


										// &control ingresos gastos

router.get("/control_ingresos_gastos", async(req,res)=>{
	const datos = await pool.query(`SELECT
									  id,
									  titulo,
									  fecha_inicio,
									  fecha_fin,
									  TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS fecha_inicio_f,
									  TO_CHAR(fecha_fin, 'DD-MM-YYYY') AS fecha_fin_f

									  FROM control_finanzas`);
	const Datos = datos.rows; 

	res.render("./finanzas/control_ingresos_gastos/index",{Datos});
});

router.get("/control_ingresos_gastos/add", async(req,res)=>{
	res.render("./finanzas/control_ingresos_gastos/add_control");
});
router.post("/control_ingresos_gastos/add", async(req,res)=>{
	const {
		titulo_control,
		fecha_inicio,
		fecha_fin
	} = req.body;

	const datos = {
		titulo_control,
		fecha_inicio,
		fecha_fin
	};
	console.log(datos);
	await pool.query(`INSERT INTO control_finanzas (
		id,
		titulo,
		fecha_inicio,
		fecha_fin)

		VALUES
		(DEFAULT,$1,$2,$3)`,[...Object.values(datos)])

	res.redirect("/finanzas/control_ingresos_gastos");
});

// router.get("/control_ingresos_gastos/:id")

// router.get("/control_ingresos_gastos/registros")

// router.get("/control_ingresos_gastos")

													


													//&trabajos
router.get("/trabajos", async (req,res)=>{
	const datos = await pool.query(`SELECT id,
														nombre,
														fecha_inicio,
														fecha_fin,
														TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS fecha_inicio_f
														FROM trabajos ORDER BY fecha_inicio DESC`);
	const Datos = datos.rows;
	res.render("./finanzas/trabajos/index", {Datos});
});

router.get("/trabajos/anteriores", async (req,res)=>{
	res.render("./finanzas/trabajos/trabajos_anteriores");
});

router.get("/trabajos/add", async (req,res)=>{
	res.render("./finanzas/trabajos/add_trabajo");
});


router.post("/trabajos/add", async (req,res)=>{
	const {nombre,fecha} = req.body;

	const datos = {
		nombre,
		fecha
	};

	await pool.query(`INSERT INTO trabajos (
		id,
		nombre,
		fecha_inicio,
		fecha_fin)

		VALUES
		(DEFAULT,$1,$2,NULL)`,[...Object.values(datos)]);
	res.redirect("/finanzas/trabajos")
});

router.get("/trabajo/edit/:id", async(req,res)=>{
	const {id} = req.params;
	const datos = await pool.query(`SELECT
												id,
												nombre,
												fecha_inicio,
												fecha_fin,
												TO_CHAR(fecha_inicio, 'YYYY-MM-DD HH24:MI') AS fecha_inicio_f,
												TO_CHAR(fecha_fin, 'YYYY-MM-DD HH24:MI') AS fecha_fin_f
		FROM trabajos WHERE id = $1`,[id]);



	
	const Datos = datos.rows[0];
	res.render("./finanzas/trabajos/edit_trabajo",{Datos});
});
router.post("/trabajo/edit/:id", async(req,res)=>{
	const{id} = req.params
	const {nombre_trabajo,fecha_inicio,fecha_fin} = req.body;
	const datos = {
	nombre_trabajo,
	fecha_inicio,
	fecha_fin,
	id
	};

		if (datos.fecha_fin == "") {
		datos.fecha_fin = null;
	};

	await pool.query(`UPDATE trabajos SET nombre = $1, fecha_inicio = $2, fecha_fin = $3 WHERE id = $4`,[...Object.values(datos)])
	res.redirect(`/finanzas/trabajos`);
});

router.get("/trabajo/delet/:id", async(req ,res)=>{
	const {id} = req.params;
	await pool.query("DELETE FROM finanzas WHERE trabajo = $1",[id])
	await pool.query("DELETE FROM etiquetas_trabajos WHERE trabajos_id = $1;",[id]);
	await pool.query("DELETE FROM trabajos WHERE id = $1;",[id]);

	res.redirect("/finanzas/trabajos");
})

router.get("/trabajo/:id", async (req,res)=>{
	const {id} = req.params;
	const id_trabajo = id;

	const datos = await pool.query(`SELECT

										etiquetas_trabajos.id AS id_etiqueta,
										etiquetas_trabajos.nombre AS nombre_etiqueta,
										etiquetas_trabajos.trabajos_id AS id_trabajo_etiqueta,
										etiquetas_trabajos.descripcion,
										etiquetas_trabajos.ingreso,

										finanzas_bancos.id AS id_banco,
										finanzas_bancos.nombre AS nombre_banco,

										finanzas_tipo_dinero.id AS id_tipo_dinero,
										finanzas_tipo_dinero.simbolo AS simbolo_tipo_dinero

										FROM etiquetas_trabajos
										LEFT JOIN finanzas_bancos ON etiquetas_trabajos.banco = finanzas_bancos.id
										LEFT JOIN finanzas_tipo_dinero ON etiquetas_trabajos.finanzas_tipo_dinero = finanzas_tipo_dinero.id
										WHERE etiquetas_trabajos.trabajos_id = $1
										ORDER BY etiquetas_trabajos.nombre ASC`
										,[id]);
	const Datos = datos.rows;
	const Id_trabajo = id;
	res.render("./finanzas/trabajos/trabajo",{Id_trabajo,Datos});
});

router.get("/trabajo/etiqueta_add/:id", async (req,res)=>{
	const {id} = req.params;
	const datos = await pool.query(`SELECT*FROM trabajos WHERE id = $1`,[id]);
	const Datos = datos.rows[0];

	const bancos = await pool.query(`SELECT*FROM finanzas_bancos ORDER BY posicion ASC`);
	const Bancos = bancos.rows;

	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC`);
	const Tipo_Dinero = tipo_dinero.rows;

	res.render("./finanzas/trabajos/add_etiqueta_trabajo",{Datos,Bancos,Tipo_Dinero});
});

router.post("/trabajo/etiqueta_add/:id", async (req,res)=>{
	const {id_trabajo,nombre_etiqueta,descripcion_etiqueta,ingreso_etiqueta,id_tipo_monto_registros,id_banco_registros} = req.body;
	const datos = {
		id_trabajo,
		nombre_etiqueta,
		descripcion_etiqueta,
		ingreso_etiqueta,
		id_tipo_monto_registros,
		id_banco_registros
	};
	await pool.query(`INSERT INTO etiquetas_trabajos (
		id,
		trabajos_id,
		nombre,
		descripcion,
		ingreso,
		finanzas_tipo_dinero,
		banco
		)

		VALUES
		(DEFAULT,$1,$2,$3,$4,$5,$6)`,[...Object.values(datos)]);
	res.redirect(`/finanzas/trabajo/${datos.id_trabajo}`)
});

router.get("/trabajo/etiqueta_edit/:id_etiqueta/:id_trabajo", async(req,res)=>{
	const {id_etiqueta} = req.params;
	const {id_trabajo} = req.params;
	const datos = await pool.query(`SELECT

										etiquetas_trabajos.id AS id_etiqueta,
										etiquetas_trabajos.nombre AS nombre_etiqueta,
										etiquetas_trabajos.trabajos_id AS id_trabajo,
										etiquetas_trabajos.descripcion,
										etiquetas_trabajos.ingreso,

										finanzas_bancos.id AS id_banco,
										finanzas_bancos.nombre AS nombre_banco,

										finanzas_tipo_dinero.id AS id_tipo_dinero,
										finanzas_tipo_dinero.simbolo AS simbolo_tipo_dinero


										FROM etiquetas_trabajos
										RIGHT JOIN finanzas_bancos ON etiquetas_trabajos.banco = finanzas_bancos.id
										RIGHT JOIN finanzas_tipo_dinero ON etiquetas_trabajos.finanzas_tipo_dinero = finanzas_tipo_dinero.id
										WHERE etiquetas_trabajos.trabajos_id = $1 AND etiquetas_trabajos.id = $2`,[id_trabajo,id_etiqueta]);
	const Datos = datos.rows[0];
	console.log(Datos);

	const bancos = await pool.query(`SELECT*FROM finanzas_bancos ORDER BY posicion ASC`);
	const Bancos = bancos.rows;

	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC`);
	const Tipo_Dinero = tipo_dinero.rows;


	res.render("./finanzas/trabajos/edit_trabajo_etiqueta",{Datos,Bancos,Tipo_Dinero});
});
router.post("/trabajo/etiqueta_edit/:id_etiqueta/:id_trabajo", async(req,res)=>{
	const {id_etiqueta} = req.params;
	const {id_trabajo} = req.params;
	const {id_etiqueta_trabajo,nombre_etiqueta,descripcion_etiqueta,ingreso_etiqueta,id_tipo_monto_registros,id_banco_registros} = req.body;
	const datos = {
		nombre_etiqueta,
		descripcion_etiqueta,
		ingreso_etiqueta,
		id_tipo_monto_registros,
		id_banco_registros,
		id_etiqueta_trabajo
	};
	await pool.query(`UPDATE etiquetas_trabajos SET
							nombre = $1,
							descripcion = $2,
							ingreso = $3,
							finanzas_tipo_dinero = $4,
							banco = $5
							WHERE id = $6
		`,[...Object.values(datos)]);
	res.redirect(`/finanzas/trabajo/${id_trabajo}`)
});

router.get("/trabajo/etiqueta_delet/:id/:id_etiqueta", async(req,res)=>{
	const {id, id_etiqueta} = req.params;
	await pool.query(`UPDATE finanzas SET etiquetas_trabajos = NULL WHERE etiquetas_trabajos = $1`,[id_etiqueta]);
	await pool.query(`DELETE FROM etiquetas_trabajos WHERE id = $1`,[id_etiqueta]);
	res.redirect(`/finanzas/trabajo/${id}`);
});

router.post("/trabajo/insertar_registros/:id_trabajo/:id_etiqueta", async(req,res)=>{
	const {id_trabajo,id_etiqueta} = req.params;
	const {descripcion,dinero,id_banco,id_tipo_dinero} = req.body;
	
	const datos = {
		descripcion,
		id_trabajo: id_trabajo,
		id_etiqueta: id_etiqueta,
		id_banco,
		dinero,
		id_tipo_dinero,
		dinero_actual:0,
		
	}

// if (datos.id_control_registros == ""){
// 		datos.id_control_registros = null;
// 	}
// 	if (datos.id_lista_registros == ""){
// 		datos.id_lista_registros = null;
// 	}

	await pool.query(`INSERT INTO finanzas (
		id,
		descripcion,
		trabajo,
		etiquetas_trabajos,
		banco,
		dinero,
		finanzas_tipo_dinero,
		dinero_actual,
		fecha)

		VALUES
		(DEFAULT,$1,$2,$3,$4,$5,$6,$7,now())`,[...Object.values(datos)])
	res.redirect(`/finanzas//registros/calcular_dinero`)
})


												// &configuraciones
router.get("/configuraciones", async(req,res)=>{
	const etiquetas = await pool.query(`SELECT*FROM finanzas_etiquetas ORDER BY posicion ASC;`)
	const Etiquetas = etiquetas.rows;

	const bancos = await pool.query(`SELECT*FROM finanzas_bancos ORDER BY posicion ASC;`)
	const Bancos = bancos.rows;

	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC;`)
	const Tipo_Dinero = tipo_dinero.rows;
	res.render("./finanzas/configuraciones/configuraciones",{Etiquetas, Bancos, Tipo_Dinero})
});

router.get("/add_etiqueta", async(req,res)=>{
	res.render("./finanzas/configuraciones/etiquetas/add_etiqueta");
});
router.post("/add_etiqueta", async(req,res)=>{
	const {etiqueta_nombre,etiqueta_posicion} = req.body;
	const datos = {
		etiqueta_nombre,
		etiqueta_posicion
	};
	await pool.query(`INSERT INTO finanzas_etiquetas (id,nombre,posicion) VALUES(DEFAULT, $1,$2)`,[...Object.values(datos)]);
	res.redirect("/finanzas/configuraciones");
});


router.get("/add_sub_etiqueta", async(req,res)=>{
	res.render("./finanzas/configuraciones/etiquetas/add_sub_etiqueta")
});

router.get("/edit_etiqueta/:id", async(req,res)=>{
	const {id} =  req.params;
	const etiqueta = await pool.query(`SELECT*FROM finanzas_etiquetas WHERE id = $1;`,[id]);
	const Etiqueta = etiqueta.rows[0]
	res.render("./finanzas/configuraciones/etiquetas/edit_etiqueta",{Etiqueta});
});
router.post("/edit_etiqueta/:id", async(req,res)=>{
	const {id} =  req.params;
	const {etiqueta_nombre,etiqueta_posicion} = req.body;
	const datos = {
		etiqueta_nombre,
		etiqueta_posicion,
		id
	};
	await pool.query(`UPDATE finanzas_etiquetas SET nombre = $1, posicion = $2 WHERE id = $3;`,[...Object.values(datos)]);
	res.redirect("/finanzas/configuraciones");
});

router.get("/elim_etiqueta/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`DELETE FROM finanzas_etiquetas WHERE id = $1;`,[id])
	res.redirect("/finanzas/configuraciones");
});



router.get("/add_banco", async(req,res)=>{
	res.render("./finanzas/configuraciones/bancos/add_banco");
});
router.post("/add_banco", async(req,res)=>{
	const {banco_nombre,banco_posicion} = req.body;
	const datos = {
		banco_nombre,
		banco_posicion
	};
	await pool.query(`INSERT INTO finanzas_bancos (id,nombre,posicion) VALUES(DEFAULT, $1,$2)`,[...Object.values(datos)]);
	res.redirect("/finanzas/configuraciones");
});

router.get("/edit_banco/:id", async(req,res)=>{
	const {id} =  req.params;
	const banco = await pool.query(`SELECT*FROM finanzas_bancos WHERE id = $1;`,[id]);
	const Banco = banco.rows[0];
	res.render("./finanzas/configuraciones/bancos/edit_banco",{Banco});
});
router.post("/edit_banco/:id", async(req,res)=>{
	const {id} =  req.params;
	const {banco_nombre,banco_posicion} = req.body;
	const datos = {
		banco_nombre,
		banco_posicion,
		id
	};
	await pool.query(`UPDATE finanzas_bancos SET nombre = $1, posicion = $2 WHERE id = $3;`,[...Object.values(datos)]);
	res.redirect("/finanzas/configuraciones");
});

router.get("/elim_banco/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`DELETE FROM finanzas_bancos WHERE id = $1;`,[id])
	res.redirect("/finanzas/configuraciones");
});




router.get("/add_tipo_dinero", async(req,res)=>{
	res.render("./finanzas/configuraciones/tipo_dinero/add_tipo_dinero");
});
router.post("/add_tipo_dinero", async(req,res)=>{
	const {tipo_dinero_nombre,tipo_dinero_simbolo,tipo_dinero_color,tipo_dinero_posicion} = req.body;
	const datos = {
		tipo_dinero_nombre,
		tipo_dinero_simbolo,
		tipo_dinero_color,
		tipo_dinero_posicion
	};
	await pool.query(`INSERT INTO finanzas_tipo_dinero (id,nombre,simbolo,color,posicion) VALUES(DEFAULT, $1,$2,$3,$4)`,[...Object.values(datos)]);
	res.redirect("/finanzas/configuraciones");
});

router.get("/edit_tipo_dinero/:id", async(req,res)=>{
	const {id} =  req.params;
	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero WHERE id = $1;`,[id]);
	const Tipo_Dinero = tipo_dinero.rows[0];
	res.render("./finanzas/configuraciones/tipo_dinero/edit_tipo_dinero",{Tipo_Dinero});
});
router.post("/edit_tipo_dinero/:id", async(req,res)=>{
	const {id} =  req.params;
	const {tipo_dinero_nombre,tipo_dinero_simbolo,tipo_dinero_color,tipo_dinero_posicion} = req.body;
	const datos = {
		tipo_dinero_nombre,
		tipo_dinero_simbolo,
		tipo_dinero_color,
		tipo_dinero_posicion,
		id
	};
	await pool.query(`UPDATE finanzas_tipo_dinero SET nombre = $1, simbolo = $2, color = $3, posicion = $4 WHERE id = $5;`,[...Object.values(datos)]);
	res.redirect("/finanzas/configuraciones");
});

router.get("/elim_tipo_dinero/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`DELETE FROM finanzas_tipo_dinero WHERE id = $1;`,[id])
	res.redirect("/finanzas/configuraciones");
});

														// &control_dinero																	

router.get("/control_dinero",async(req,res)=>{
	const datos = await pool.query(`SELECT id,dinero,id_tipo_dinero,tipo_dinero,descripcion,
											 TO_CHAR(fecha_inicio, 'DD-MM-YYYY HH24:MI') AS fecha_inicio,
											 TO_CHAR(fecha_fin, 'DD-MM-YYYY HH24:MI') AS fecha_fin
											 FROM finanzas_control_dinero ORDER BY fecha_inicio DESC;`);
	const Datos = datos.rows;
	res.render("./finanzas/control_dinero/index",{Datos});
});

router.get("/add/control_dinero",async(req,res)=>{
	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC;`);
	const Tipo_Dinero = tipo_dinero.rows;
	res.render("./finanzas/control_dinero/add_control_dinero",{Tipo_Dinero});
});
router.post("/add/control_dinero",async(req,res)=>{
	const {fecha_inicio,control_dinero_cantidad,id_select,control_dinero_tipo_dinero,control_dinero_descripcion} = req.body;
	const datos = {
		
		control_dinero_cantidad,
		id_select,
		control_dinero_tipo_dinero,
		control_dinero_descripcion,
		fecha_inicio
	};
	await pool.query(`INSERT INTO finanzas_control_dinero (id,dinero,id_tipo_dinero, tipo_dinero, descripcion,fecha_inicio,fecha_fin) 
					  VALUES (DEFAULT, $1,$2,$3,$4,$5,NULL)`,
		[...Object.values(datos)]);
	res.redirect("/finanzas/control_dinero");
});

router.get("/edit/control_dinero/:id", async(req,res)=>{
	const {id} =  req.params;
	const control_dinero = await pool.query(`SELECT id,dinero,id_tipo_dinero,tipo_dinero,descripcion,
											 TO_CHAR(fecha_inicio, 'YYYY-MM-DD HH24:MI') AS fecha_inicio,
											 TO_CHAR(fecha_fin, 'YYYY-MM-DD HH24:MI') AS fecha_fin
											 FROM finanzas_control_dinero WHERE id = $1;`,[id]);
	const Control_Dinero = control_dinero.rows[0];

	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC;`);
	const Tipo_Dinero = tipo_dinero.rows;

	res.render("./finanzas/control_dinero/edit_control_dinero",{Control_Dinero, Tipo_Dinero});
});
router.post("/edit/control_dinero/:id", async(req,res)=>{
	const {id} =  req.params;
	const {fecha_inicio,fecha_fin,control_dinero_cantidad,id_select,control_dinero_tipo_dinero,control_dinero_descripcion} = req.body;
	const datos = {
		control_dinero_cantidad,
		id_select,
		control_dinero_tipo_dinero,
		control_dinero_descripcion,
		fecha_inicio,
		fecha_fin,
		id
	};
	if(datos.fecha_fin == ""){
		datos.fecha_fin = null;
	}

	await pool.query(`UPDATE finanzas_control_dinero SET dinero = $1,id_tipo_dinero = $2, tipo_dinero=$3, descripcion=$4,fecha_inicio=$5,fecha_fin=$6 WHERE id = $7;`,[...Object.values(datos)]);
	res.redirect("/finanzas/control_dinero");
});

router.get("/elim/control_dinero/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`DELETE FROM finanzas_control_dinero WHERE id = $1;`,[id])
	res.redirect("/finanzas/control_dinero");
});


														// &Lista de Compras
router.get("/lista_compras",async (req,res)=>{
	const datos = await pool.query(`SELECT*FROM finanzas_lista_compras ORDER BY fecha_estimada_inicio DESC;`);
	const Datos = datos.rows;
	res.render("./finanzas/lista_compras/index", {Datos})
});

router.get("/add/lista_compras",async(req,res)=>{
	res.render("./finanzas/lista_compras/add_lista_compras");
});





router.post("/add/lista_compras",async(req,res)=>{
	const {fecha_inicio,control_dinero_cantidad,id_select,control_dinero_tipo_dinero,control_dinero_descripcion} = req.body;
	const datos = {
		
		control_dinero_cantidad,
		id_select,
		control_dinero_tipo_dinero,
		control_dinero_descripcion,
		fecha_inicio
	};
	await pool.query(`INSERT INTO finanzas_control_dinero (id,dinero,id_tipo_dinero, tipo_dinero, descripcion,fecha_inicio,fecha_fin) 
					  VALUES (DEFAULT, $1,$2,$3,$4,$5,NULL)`,
		[...Object.values(datos)]);
	res.redirect("/finanzas/control_dinero");
});



module.exports = router;