const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/:id", async (req,res)=>{
	const {id} = req.params;
	const objetivo = await pool.query('SELECT*FROM objetivos_individuales WHERE id = $1',[id]);
	const Objetivo = objetivo.rows[0];

	const actividad = await pool.query(`
SELECT id,objetivos_individuales,descripcion,
TO_CHAR(fecha_inicio, 'YYYY-MM-DD') AS fecha_inicio,
TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS date_inicio,
TO_CHAR(fecha_inicio, 'HH24:MI') AS time_inicio,
TO_CHAR(fecha_fin, 'DD-MM-YYYY') AS date_fin,
TO_CHAR(fecha_fin, 'HH24:MI') AS time_fin
FROM actividad_objetivos WHERE objetivos_individuales =  $1 ORDER BY fecha_inicio DESC`,[id]);
	const Actividad = actividad.rows;
	const ID = id;

 const fecha_principal = await pool.query(`SELECT DISTINCT TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS date_inicio_principal,
 																					 TO_CHAR(fecha_inicio, 'YYYY-MM-DD') AS Fecha_inicio
 																					 FROM actividad_objetivos WHERE objetivos_individuales = $1 ORDER BY fecha_inicio DESC`,[id]);
 const Fecha_principal = fecha_principal.rows;
	res.render("./objetivos_individuales/index", {Objetivo,Actividad,ID,Fecha_principal});
});

router.get("/add_tarea/:id",(req,res)=>{
	const {id} = req.params
	res.render("./objetivos_individuales/add_tarea",{id:id});
});

router.post("/add_tarea/:id", async(req,res)=>{
	const {id} = req.params;
	const {tarea} = req.body;
	await pool.query('INSERT INTO actividad_objetivos (id , descripcion , objetivos_individuales , fecha_inicio , fecha_fin) VALUES (DEFAULT,$1,$2,NULL,NULL)',
		[tarea,id])
	res.redirect(`/objetivos_sub/${id}`)
});

router.get("/edit_tarea/:id", async (req,res)=>{
	const {id} = req.params;
	await pool.query(`SELECT id,descripcion,
										TO_CHAR(fecha_inicio, 'YYYY-MM-DD HH24:MI') AS fecha_inicio,
										TO_CHAR(fecha_fin, 'YYYY-MM-DD HH24:MI') AS fecha_fin
										FROM actividad_objetivos WHERE id =  $1`,[id])
  .then(result => {
    const Datos = result.rows[0];   
    res.render("./objetivos_individuales/edit_tarea", {Datos:Datos});
  }).catch(err => {
    console.error(err);
  });

});

router.post("/edit_tarea/:id", async (req,res)=>{
	const {id} = req.params;
	const {descripcion, fecha_inicio ,fecha_fin} = req.body;
	const datos = {
		descripcion,
		fecha_inicio,
		fecha_fin
	};

	if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null;
	}
	if (datos.fecha_fin == "") {
		datos.fecha_fin = null;
	}

	const actividad = await pool.query('SELECT*FROM actividad_objetivos WHERE id = $1', [id]);
	const Actividad = actividad.rows[0].objetivos_individuales;
	await pool.query('UPDATE Actividad_objetivos SET descripcion = $1, fecha_inicio =$2 ,fecha_fin=$3 WHERE id = $4',[ datos.descripcion, datos.fecha_inicio ,datos.fecha_fin ,id]);
	res.redirect(`/objetivos_sub/${Actividad}`);
});

	router.get("/eliminar_tarea/:id", async(req,res)=>{
		const {id} = req.params;
		
		const actividad = await pool.query('SELECT*FROM actividad_objetivos WHERE id = $1', [id]);
		const Actividad = actividad.rows[0].objetivos_individuales;
		await pool.query('DELETE FROM actividad_objetivos WHERE id =$1',[id]);
		res.redirect(`/objetivos_sub/${Actividad}`);
	})


router.get("/iniciar_sub_objetivo/:id", async(req,res)=>{
	const {id} = req.params;

	const actividad = await pool.query('SELECT*FROM objetivos_individuales WHERE id = $1', [id]);
	const Actividad = actividad.rows[0];
	await pool.query(`INSERT INTO actividad_general (id, descripcion, tipo_tarea, objetivos_individuales, fecha_inicio, fecha_fin) 
										VALUES (DEFAULT, $1,'Objetivo',$2,now(),NULL )`,
										[Actividad.objetivo,Actividad.id])
	res.redirect(`/objetivos_sub/${Actividad.id}`);
});

router.get("/fin_sub_objetivo/:id", async(req,res)=>{
	const {id} = req.params;
	const actividad = await pool.query('SELECT*FROM actividad_objetivos WHERE id = $1', [id]);
	const Actividad = actividad.rows[0];
	const dato = await pool.query('SELECT*FROM actividad_general WHERE objetivos_individuales = $1 ORDER BY fecha_inicio DESC LIMIT 1',[id])
	const Dato = dato.rows[0];
	await pool.query('UPDATE actividad_general SET fecha_fin = now()  WHERE id = $1',[Dato.id])
	res.redirect(`/objetivos_sub/${id}`);
});


router.get("/iniciar_tarea/:id", async(req,res)=>{
	const {id} = req.params;
	const actividad = await pool.query('SELECT*FROM actividad_objetivos WHERE id = $1', [id]);
	const Actividad = actividad.rows[0].objetivos_individuales;
	await pool.query('UPDATE Actividad_objetivos SET fecha_inicio = now()  WHERE id = $1',[id])
	res.redirect(`/objetivos_sub/${Actividad}`);
});

router.get("/fin_tarea/:id", async(req,res)=>{
	const {id} = req.params;
	const actividad = await pool.query('SELECT*FROM actividad_objetivos WHERE id = $1', [id]);
	const Actividad = actividad.rows[0].objetivos_individuales;
	await pool.query('UPDATE Actividad_objetivos SET fecha_fin = now()  WHERE id = $1',[id])
	res.redirect(`/objetivos_sub/${Actividad}`);
});


module.exports = router;