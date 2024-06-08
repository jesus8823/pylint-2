const express = require("express");
const router = express.Router();

const XlsxPopulate = require('xlsx-populate');
const path = require("path");

const {finanzas_links} = require("../../config/links");
const {finanzas_DV} = require("../../config/direcciones_views");
const pool = require("../../database");

router.get("/",async(req,res)=>{
	const datos = await pool.query(`SELECT *FROM empresas_negocios ORDER BY nombre ASC`);
	const Datos = datos.rows;

	res.render(`${finanzas_DV.negocios_empresas.index}`, {finanzas_links, Datos});
});


router.get("/empresa/add", async(req,res)=>{
	res.render(`${finanzas_DV.negocios_empresas.add_empresa}`);
});

router.post("/empresa/add",async(req,res)=>{
	const {nombre,numero_registro,numero_telefono} = req.body;
	const datos = {
		nombre,numero_registro,numero_telefono
	}

	await pool.query(`INSERT INTO empresas_negocios (
		id,
		nombre,
		numero_registro,
		numero_telefonico)

		VALUES
		(DEFAULT,$1,$2,$3)`,[...Object.values(datos)]);
	res.redirect(`${finanzas_links.negocios_empresas.inicio}`);
})
module.exports = router;