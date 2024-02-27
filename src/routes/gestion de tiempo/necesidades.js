const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/", async (req,res)=>{

	const comer_datos = await pool.query(`SELECT descripcion, fecha_inicio, fecha_fin FROM alimentarse ORDER BY fecha_inicio DESC LIMIT 1`);
	const Comer_datos = comer_datos.rows[0];
	const dormir_datos = await pool.query(`SELECT descripcion, fecha_inicio, fecha_fin FROM dormir ORDER BY fecha_inicio DESC LIMIT 1`);
	const Dormir_datos = dormir_datos.rows[0];
	const banarse_datos = await pool.query(`SELECT id,descripcion,fecha_inicio,fecha_fin FROM necesidades WHERE descripcion = 'Bañarse' ORDER BY fecha_inicio DESC LIMIT 1`);
	const Banarse_datos = banarse_datos.rows[0];
	const irbano_datos = await pool.query(`SELECT id,descripcion,fecha_inicio,fecha_fin FROM necesidades WHERE descripcion = 'Ir al Baño' ORDER BY fecha_inicio DESC LIMIT 1`);
	const Irbano_datos = irbano_datos.rows[0];

	const fechas = await pool.query(`SELECT TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS fecha,
									 TO_CHAR(fecha_inicio,'YYYY-MM-DD') AS fecha_inicio
								FROM alimentarse
								UNION
								SELECT TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS fecha,
								TO_CHAR(fecha_inicio,'YYYY-MM-DD') AS fecha_inicio
								FROM dormir
								UNION
								SELECT TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS fecha,
								TO_CHAR(fecha_inicio,'YYYY-MM-DD') AS fecha_inicio
								FROM necesidades ORDER BY fecha_inicio DESC`);
	const Fechas = fechas.rows;
	 
	const comer_tabla = await pool.query(`SELECT id, alimentarse, descripcion, fecha_inicio, fecha_fin,
										  TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS date_inicio,
										  TO_CHAR(fecha_inicio, 'HH24:MI') AS time_inicio,
										  TO_CHAR(fecha_fin, 'HH24:MI') AS time_fin 
										  FROM alimentarse ORDER BY fecha_inicio DESC`);
	const Comer_tabla = comer_tabla.rows;

	const dormir_tabla = await pool.query(`SELECT id, descripcion, fecha_inicio, fecha_fin,
										  TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS date_inicio,
										  TO_CHAR(fecha_fin, 'DD-MM-YYYY') AS date_fin,
										  TO_CHAR(fecha_inicio, 'HH24:MI') AS time_inicio,
										  TO_CHAR(fecha_fin, 'HH24:MI') AS time_fin 
										  FROM dormir ORDER BY fecha_inicio DESC`);
	const Dormir_tabla = dormir_tabla.rows;

	const necesidades_tabla = await pool.query(`SELECT id, descripcion, fecha_inicio, fecha_fin,
										  TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS date_inicio,
										  TO_CHAR(fecha_fin, 'DD-MM-YYYY') AS date_fin,
										  TO_CHAR(fecha_inicio, 'HH24:MI') AS time_inicio,
										  TO_CHAR(fecha_fin, 'HH24:MI') AS time_fin 
										  FROM necesidades ORDER BY fecha_inicio DESC`);
	const Necesidades_tabla = necesidades_tabla.rows;


	

	res.render("./necesidades/index", {Comer_datos,Dormir_datos,Banarse_datos,Irbano_datos,Fechas,Comer_tabla,Dormir_tabla, Necesidades_tabla})
});

router.get("/add",(req,res)=>{
	res.render("./necesidades/add");
})

router.post("/add", async(req,res)=>{
	const {descripcion, fecha_inicio, fecha_fin} = req.body
	const datos = {
		descripcion,
		fecha_inicio,
		fecha_fin
	}

	if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null;
	}
	if (datos.fecha_fin == "") {
		datos.fecha_fin = null;
	}
	await pool.query('INSERT INTO necesidades (id, descripcion, fecha_inicio, fecha_fin) VALUES (DEFAULT, $1,$2,$3)',[...Object.values(datos)])
	res.redirect("/necesidades")
})

router.get("/banarse/add",async(req,res)=>{


	await pool.query(`INSERT INTO necesidades (id, descripcion, fecha_inicio, fecha_fin) VALUES (DEFAULT, 'Bañarse',now(),NULL)`)
	res.redirect("/necesidades");
})

router.get("/banarse/fin",async(req,res)=>{
	const dato = await pool.query(`SELECT * FROM necesidades WHERE descripcion = 'Bañarse' ORDER BY fecha_inicio DESC LIMIT 1;`);
	const Dato = dato.rows[0];
	await pool.query(`UPDATE necesidades SET fecha_fin = now() WHERE id = $1`,[Dato.id]);
	res.redirect("/necesidades");
})

router.get("/ir_bano/add",async(req,res)=>{

	await pool.query(`INSERT INTO necesidades (id, descripcion, fecha_inicio, fecha_fin) VALUES (DEFAULT, 'Ir al Baño',now(),NULL)`)
	res.redirect("/necesidades");
})

router.get("/ir_bano/fin",async(req,res)=>{
	const dato = await pool.query(`SELECT * FROM necesidades WHERE descripcion = 'Ir al Baño' ORDER BY fecha_inicio DESC LIMIT 1;`);
	const Dato = dato.rows[0];
	await pool.query(`UPDATE necesidades SET fecha_fin = now() WHERE id = $1`,[Dato.id]);
	res.redirect("/necesidades");
})

router.get("/fin/:id",async(req,res)=>{
	const {id} = req.params;
	await pool.query('UPDATE necesidades SET fecha_fin = now() WHERE id = $1',[id]);
	res.redirect("/necesidades")
})

router.get("/alimentarse/add", (req,res)=>{
	res.render("./comer/add");
})

router.post("/alimentarse/add", async (req,res)=>{
	const {descripcion, alimentarse} =  req.body;
	const datos = {
		descripcion,
		alimentarse,
	}
		if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null;
	}
	if (datos.fecha_fin == "") {
		datos.fecha_fin = null;
	}
	await pool.query(`INSERT INTO alimentarse (id, descripcion, alimentarse, fecha_inicio, fecha_fin) VALUES (DEFAULT,$1,$2,now(),NULL)`,
	[...Object.values(datos)])
	
	res.redirect("/necesidades");
})

router.get("/alimentarse/fin",async(req,res)=>{
	await pool.query('UPDATE alimentarse SET fecha_fin = now() WHERE id = (SELECT id FROM alimentarse ORDER BY id DESC LIMIT 1) RETURNING id');
	res.redirect("/necesidades");
})

router.get("/dormir_inicio", async(req,res)=>{
		// const estado = await pool.query('SELECT*FROM notas')
		await pool.query(`INSERT INTO dormir (id,descripcion,fecha_inicio,fecha_fin) VALUES (DEFAULT, 'Dormir', now(),NULL)`);
		res.redirect("/necesidades");
	
})

router.get("/dormir_fin", async(req,res)=>{
		
	await pool.query(`UPDATE dormir SET fecha_fin = now() WHERE id = (SELECT id FROM dormir ORDER BY id DESC LIMIT 1) RETURNING id`)
	res.redirect("/necesidades");
})

router.get("/edit/:id", async(req,res)=>{
	const {id} = req.params;
	const datos = await pool.query(`SELECT id, descripcion, 
									TO_CHAR(fecha_inicio, 'YYYY-MM-DD HH24:MI') AS fecha_inicio,
									TO_CHAR(fecha_fin, 'YYYY-MM-DD HH24:MI') AS fecha_fin
									FROM necesidades WHERE id = $1`, [id]);
	const Datos = datos.rows[0];
	console.log(Datos);
	res.render("./necesidades/edit", {Datos});
})
router.post("/edit/:id",async (req,res)=>{
	const {id} = req.params;
	const {descripcion, fecha_inicio, fecha_fin} = req.body;
	const datos = {
		descripcion,
		fecha_inicio,
		fecha_fin,
		id : id
	};

		if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null;
	}
	if (datos.fecha_fin == "") {
		datos.fecha_fin = null;
	}
	await pool.query('UPDATE necesidades SET descripcion = $1, fecha_inicio = $2, fecha_fin = $3 WHERE id = $4',
										[...Object.values(datos)])
	res.redirect("/necesidades");
});
router.get("/delete/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query('DELETE FROM necesidades WHERE id = $1', [id]);
	res.redirect("/necesidades")
})



router.get("/dormir/edit/:id", async(req,res)=>{
	const {id} = req.params;
	const datos = await pool.query(`SELECT id, descripcion, 
									TO_CHAR(fecha_inicio, 'YYYY-MM-DD HH24:MI') AS fecha_inicio,
									TO_CHAR(fecha_fin, 'YYYY-MM-DD HH24:MI') AS fecha_fin
									FROM dormir WHERE id = $1`, [id]);
	const Datos = datos.rows[0];
	console.log(Datos);
	res.render("./necesidades/dormir_edit", {Datos});
})
router.post("/dormir/edit/:id",async (req,res)=>{
	const {id} = req.params;
	const {descripcion, fecha_inicio, fecha_fin} = req.body;
	const datos = {
		fecha_inicio,
		fecha_fin,
		id : id
	};

		if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null;
	}
	if (datos.fecha_fin == "") {
		datos.fecha_fin = null;
	}
	await pool.query('UPDATE dormir SET fecha_inicio = $1, fecha_fin = $2 WHERE id = $3',
										[...Object.values(datos)])
	res.redirect("/necesidades");
});
router.get("/dormir/delete/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query('DELETE FROM dormir WHERE id = $1', [id]);
	res.redirect("/necesidades")
})

router.get("/alimentarse/edit/:id", async(req,res)=>{
	const {id} = req.params;
	const datos = await pool.query(`SELECT id, descripcion, alimentarse,
									TO_CHAR(fecha_inicio, 'YYYY-MM-DD HH24:MI') AS fecha_inicio,
									TO_CHAR(fecha_fin, 'YYYY-MM-DD HH24:MI') AS fecha_fin
									FROM alimentarse WHERE id = $1`, [id]);
	const Datos = datos.rows[0];
	console.log(Datos);
	res.render("./comer/edit", {Datos});
})
router.post("/alimentarse/edit/:id",async (req,res)=>{
	const {id} = req.params;
	const {descripcion, alimentarse ,fecha_inicio, fecha_fin} = req.body;
	const datos = {
		descripcion,
		alimentarse,
		fecha_inicio,
		fecha_fin,
		id : id
	};

		if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null;
	}
	if (datos.fecha_fin == "") {
		datos.fecha_fin = null;
	}
	await pool.query('UPDATE alimentarse SET descripcion = $1, alimentarse = $2 ,fecha_inicio = $3, fecha_fin = $4 WHERE id = $5',
										[...Object.values(datos)])
	res.redirect("/necesidades");
});
router.get("/alimentarse/delete/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query('DELETE FROM alimentarse WHERE id = $1', [id]);
	res.redirect("/necesidades")
})




module.exports = router;