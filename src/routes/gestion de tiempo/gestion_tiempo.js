const express = require("express");
const router = express.Router();

const XlsxPopulate = require('xlsx-populate');
const path = require("path");

const {finanzas_links} = require("../../config/links");
const {gestion_tiempo_DV} = require("../../config/direcciones_views");
const pool = require("../../database");


router.get("/",async (req,res)=>{
	res.render(`${gestion_tiempo_DV.index}`)
});


router.get("/metas",async (req,res)=>{
	res.render(`${gestion_tiempo_DV.metas.index}`)
});

router.get("/metas/add",async (req,res)=>{
	res.render(`${gestion_tiempo_DV.metas.index}`)
});

module.exports = router;