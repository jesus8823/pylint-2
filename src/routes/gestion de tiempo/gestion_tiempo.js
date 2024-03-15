const express = require("express");
const router = express.Router();

const XlsxPopulate = require('xlsx-populate');
const path = require("path");

const {gestion_tiempo_links} = require("../../config/links");
const {gestion_tiempo_DV} = require("../../config/direcciones_views");
const pool = require("../../database");


router.get("/",async (req,res)=>{
	res.render(`${gestion_tiempo_DV.index}`)
});


router.get("/metas",async (req,res)=>{
	const metas = await pool.query(`SELECT*FROM metas ORDER BY fecha_cumplimiento DESC;`);
	const Metas = metas.rows;

	const objetivos = await pool.query(`SELECT*FROM objetivos ORDER BY fecha_cumplimiento DESC;`)
	const Objetivos = objetivos.rows;

	const tareas = await pool.query(`SELECT*FROM tareas ORDER BY fecha_cumplimiento DESC;`)
	const Tareas = tareas.rows;
	
	res.render(`${gestion_tiempo_DV.metas.index}`, {Metas,Objetivos,Tareas,gestion_tiempo_links})
});

router.get("/metas/add",async (req,res)=>{
	res.render(`${gestion_tiempo_DV.metas.add}`)
});

router.post("/metas/add", async(req,res)=>{
	const {titulo,descripcion,fecha_inicio,fecha_plazo} = req.body;

	const datos = {
		titulo,
		descripcion,
		fecha_inicio,
		fecha_plazo
	};

	await pool.query(`INSERT INTO metas (
		id,
		titulo,
		descripcion,
		fecha_registro,
		fecha_inicio,
		fecha_cumplimiento,
		fecha_fin)

		VALUES
		(DEFAULT,$1,$2,now(),$3,$4,NULL)`,[...Object.values(datos)]);
	res.redirect("/gestion_tiempo/metas")
})

router.get("/metas/objetivos/add/:id",async (req,res)=>{
	const {id} = req.params;
	res.render(`${gestion_tiempo_DV.objetivos.add}`, {gestion_tiempo_links, id})
});

router.post("/metas/objetivos/add/:id", async(req,res)=>{
	const {id} = req.params;
	const {titulo,descripcion,fecha_inicio,fecha_plazo} = req.body;

	const datos = {
		titulo,
		descripcion,
		meta: id,
		fecha_inicio,
		fecha_plazo
	};

	await pool.query(`INSERT INTO objetivos (
		id,
		titulo,
		descripcion,
		meta,
		fecha_registro,
		fecha_inicio,
		fecha_cumplimiento,
		fecha_fin)

		VALUES
		(DEFAULT,$1,$2,$3,now(),$4,$5,NULL)`,[...Object.values(datos)]);
	res.redirect("/gestion_tiempo/metas")
})

router.get("/metas/tareas/add/:ido/:idm",async (req,res)=>{
	const {ido,idm} = req.params;
	res.render(`${gestion_tiempo_DV.tareas.add}`, {gestion_tiempo_links, ido, idm})
});

router.post("/metas/tareas/add/:ido/:idm", async(req,res)=>{
	const {ido,idm} = req.params;
	const {titulo,descripcion,fecha_inicio,fecha_plazo} = req.body;

	const datos = {
		titulo,
		descripcion,
		meta: idm,
		objetivo: ido,
		fecha_inicio,
		fecha_plazo
	};

	await pool.query(`INSERT INTO tareas (
		id,
		titulo,
		descripcion,
		meta,
		objetivos,
		fecha_registro,
		fecha_inicio,
		fecha_cumplimiento,
		fecha_fin)

		VALUES
		(DEFAULT,$1,$2,$3,$4,now(),$5,$6,NULL)`,[...Object.values(datos)]);
	res.redirect("/gestion_tiempo/metas")
})

module.exports = router;