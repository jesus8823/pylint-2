const express = require("express");
const router = express.Router();

const XlsxPopulate = require('xlsx-populate');
const path = require("path");

const {finanzas_links} = require("../../config/links");
const {finanzas_DV} = require("../../config/direcciones_views");
const pool = require("../../database");




//&gastos
router.get("/",async(req,res)=>{
	res.render("./finanzas/gastos/index");
});

router.get("/add_registros", async(req,res)=>{
	const etiquetas = await pool.query(`SELECT*FROM finanzas_etiquetas ORDER BY posicion ASC`);
	const Etiquetas = etiquetas.rows;

	const bancos = await pool.query(`SELECT*FROM finanzas_bancos ORDER BY posicion ASC`);
	const Bancos = bancos.rows;

	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC`);
	const Tipo_Dinero = tipo_dinero.rows;
	res.render("./finanzas/gastos/add_registros", {Etiquetas, Bancos, Tipo_Dinero});
});

router.post("/add_registros", async(req,res)=>{
	const {
		descripcion_registros,

		id_etiqueta_registros,
		etiqueta_registros,

		monto,

		id_tipo_monto_registros,
		tipo_monto_registros,

		id_banco_registros,
		banco_registros,

		fecha

	} = req.body;
	const datos = {
		descripcion_registros,
		id_etiqueta_registros,
		id_banco_registros,
		monto,
		id_tipo_monto_registros,
		dinero_actual:0,
		fecha

	}

if (datos.id_control_registros == ""){
		datos.id_control_registros = null;
	}
	if (datos.id_lista_registros == ""){
		datos.id_lista_registros = null;
	}

	await pool.query(`INSERT INTO finanzas (
		id,
		descripcion,
		etiquetas_gastos,
		banco,
		dinero,
		finanzas_tipo_dinero,
		dinero_actual,
		fecha)

		VALUES
		(DEFAULT,$1,$2,$3,$4,$5,$6,$7)`,[...Object.values(datos)])


	res.redirect("/finanzas/registros/calcular_dinero")
})


router.get("/etiquetas", async(req,res)=>{
	const etiquetas = await pool.query(`SELECT*FROM finanzas_etiquetas ORDER BY posicion ASC;`)
	const Etiquetas = etiquetas.rows;
	res.render("./finanzas/gastos/etiquetas/etiquetas", {Etiquetas});
});

router.get("/add_etiqueta", async(req,res)=>{
	res.render("./finanzas/gastos/etiquetas/add_etiqueta");
});
router.post("/add_etiqueta", async(req,res)=>{
	const {etiqueta_nombre,etiqueta_posicion} = req.body;
	const datos = {
		etiqueta_nombre,
		etiqueta_posicion
	};
	await pool.query(`INSERT INTO finanzas_etiquetas (id,nombre,posicion) VALUES(DEFAULT, $1,$2)`,[...Object.values(datos)]);
	res.redirect("/finanzas/gastos/etiquetas");
});

router.get("/edit_etiqueta/:id", async(req,res)=>{
	const {id} =  req.params;
	const etiqueta = await pool.query(`SELECT*FROM finanzas_etiquetas WHERE id = $1;`,[id]);
	const Etiqueta = etiqueta.rows[0]
	res.render("./finanzas/gastos/etiquetas/edit_etiqueta",{Etiqueta});
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
	res.redirect("/finanzas/gastos/etiquetas");
});

router.get("/elim_etiqueta/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`DELETE FROM finanzas_etiquetas WHERE id = $1;`,[id])
	res.redirect("/finanzas/gastos/etiquetas");
});

module.exports = router;