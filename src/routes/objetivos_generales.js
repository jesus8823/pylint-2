const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/", async (req,res)=>{

	const objetivos = await pool.query('SELECT*FROM objetivos_generales ORDER BY posicion');
	const Objetivos = objetivos.rows;
	
	const objetivos_indi = await pool.query('SELECT*FROM objetivos_individuales ORDER BY posicion');
	const Objetivos_indi = objetivos_indi.rows;

	res.render("./objetivos_generales/index", {Objetivos:Objetivos, Objetivos_indi:Objetivos_indi});
});



router.get("/add", async (req,res)=>{
	res.render("./objetivos_generales/add");
});

router.post("/add",async (req,res)=>{
	const {objetivo_name,posicion} = req.body
	const datos = {
		objetivo_name,
		posicion
	};
	await pool.query(`INSERT INTO objetivos_generales (id,objetivo,posicion,fecha_fin) VALUES (DEFAULT, $1, $2,NULL)`,[datos.objetivo_name,datos.posicion]);
		
	res.redirect("/objetivos");
})

router.get("/sub/add/:id", async (req,res)=>{
	const {id} = req.params;
		await pool.query('SELECT id,objetivo FROM objetivos_generales WHERE id = $1', [id])
  .then(result => {
    const Datos = result.rows[0];   			
    res.render("./objetivos_generales/add_sub", {Datos:Datos});
  }).catch(err => {
    console.error(err);
  });
});

router.post("/sub/add/:id",async (req,res)=>{
	const {id} = req.params
	const {objetivo_name,descripcion,posicion} = req.body
	const datos = {
		objetivo_name,
		descripcion,
		posicion
	};
	await pool.query(`INSERT INTO objetivos_individuales (id,objetivo_general,objetivo,descripcion,posicion,fecha_inicio,fecha_fin) VALUES (DEFAULT, $1, $2,$3,$4,NULL,NULL)`,
		[id,datos.objetivo_name,datos.descripcion,datos.posicion]);
		

	res.redirect("/objetivos");
})

router.get("/edit/:id", async (req,res)=>{
	const {id} = req.params;
	await pool.query('SELECT id,objetivo,posicion FROM objetivos_generales WHERE id = $1', [id])
  .then(result => {
    const Datos = result.rows[0];   			
    res.render("./objetivos_generales/edit", {Datos:Datos});
  }).catch(err => {
    console.error(err);
  });

});

router.post("/edit/:id", async (req,res)=>{
	const {id} = req.params;
	const {objetivo_name, objetivo_posicion} = req.body;
	const datos = {
		objetivo_name,
		objetivo_posicion
	};
	await pool.query('UPDATE objetivos_generales SET objetivo=$1, posicion=$2, fecha_fin=NULL WHERE id = $3',[ datos.objetivo_name, datos.objetivo_posicion ,id]);
	res.redirect("/objetivos");
});

router.get("/delete/:id",(req,res)=>{
	const {id} = req.params;
	try{
		pool.query('DELETE FROM objetivos_generales WHERE id = $1', [id]);
	}catch(error){
		console.log(error);
	}
	
	res.redirect("/objetivos");
});


router.get("/sub/edit/:id", async (req,res)=>{
	const {id} = req.params;
	await pool.query('SELECT id,objetivo,descripcion,posicion FROM objetivos_individuales WHERE id = $1', [id])
  .then(result => {
    const Datos = result.rows[0];   			
    res.render("./objetivos_generales/edit_sub", {Datos:Datos});
  }).catch(err => {
    console.error(err);
  });

});

router.post("/sub/edit/:id", async (req,res)=>{
	const {id} = req.params;
	const {objetivo_name, descripcion ,posicion} = req.body;
	const datos = {
		objetivo_name,
		descripcion,
		posicion
	};
	await pool.query('UPDATE objetivos_individuales SET objetivo=$1,descripcion = $2, posicion=$3,fecha_inicio = NULL ,fecha_fin=NULL WHERE id = $4',[ datos.objetivo_name, datos.descripcion ,datos.posicion ,id]);
	res.redirect("/objetivos");
});

router.get("/sub/delete/:id",(req,res)=>{
	const {id} = req.params;
		pool.query('DELETE FROM objetivos_individuales WHERE id = $1', [id]);
	res.redirect("/objetivos");
});



module.exports = router;