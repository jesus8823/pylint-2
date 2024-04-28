const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/", async (req,res)=>{

	Promise.all([
  pool.query(`SELECT DISTINCT TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS fecha, 
  	TO_CHAR(fecha_inicio, 'YYYY-MM-DD') AS fecha_inicio 
  	FROM actividad_general 
  	ORDER BY fecha_inicio DESC`),
  pool.query(`SELECT id, descripcion, tipo_tarea, objetivos_individuales, 
              TO_CHAR(fecha_inicio, 'DD-MM-YYYY') AS date_inicio,  
              TO_CHAR(fecha_inicio, 'HH24:MI') AS time_inicio,
              TO_CHAR(fecha_fin, 'HH24:MI') AS time_fin
              FROM actividad_general ORDER BY fecha_inicio DESC,time_inicio ASC`),
  pool.query(`SELECT id,descripcion,TO_CHAR(fecha, 'DD-MM-YYYY') AS date FROM notas`)

])

  .then(([result1, result2, result3]) => {
    const fechas_actividad = result1.rows;
    const datos_actividad = result2.rows;
    const notas_actividad = result3.rows;
    res.render("./actividad_general/index", {fechas_actividad, datos_actividad, notas_actividad});
  })
  .catch(err => {
    console.error(err);
    // Manejar el error apropiadamente
  });
})

router.get("/add",(req,res)=>{
	res.render("./actividad_general/add")
})

router.post("/add", async(req,res)=>{
	const {descripcion, tipo_tarea, fecha_inicio, fecha_fin} =  req.body;
	const datos = {
		descripcion,
		tipo_tarea,
		fecha_inicio,
		fecha_fin
	}
		if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null;
	}
	if (datos.fecha_fin == "") {
		datos.fecha_fin = null;
	}
	await pool.query(`INSERT INTO actividad_general (id, descripcion, tipo_tarea, objetivos_individuales, fecha_inicio, fecha_fin) VALUES (DEFAULT,$1,$2,NULL,$3,$4)`,
	[datos.descripcion,datos.tipo_tarea,datos.fecha_inicio,datos.fecha_fin])
	
	res.redirect("/actividad");
})

router.get("/edit/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`SELECT id,descripcion, tipo_tarea,
										TO_CHAR(fecha_inicio, 'YYYY-MM-DD HH24:MI') AS fecha_inicio,
										TO_CHAR(fecha_fin, 'YYYY-MM-DD HH24:MI') AS fecha_fin
										FROM actividad_general WHERE id =  $1`,[id])
  .then(result => {
    const Datos = result.rows[0];
    res.render("./actividad_general/edit", {Datos:Datos});
  }).catch(err => {
    console.error(err);
  }); 
});

router.post("/edit/:id",async (req,res)=>{
	const {id} = req.params;
	const {descripcion, tipo_tarea, fecha_inicio, fecha_fin} = req.body;
	const datos = {
		descripcion,
		tipo_tarea,
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
	await pool.query('UPDATE actividad_general SET descripcion = $1, tipo_tarea = $2, fecha_inicio = $3, fecha_fin = $4 WHERE id = $5',
										[...Object.values(datos)])
	res.redirect("/actividad");
});

router.get("/delete/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query('DELETE FROM actividad_general WHERE id = $1',[id]);
	res.redirect("/actividad");
})

router.get("/inicio/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query("UPDATE actividad_general SET fecha_inicio = now() WHERE id = $1",[id]);
	res.redirect("/actividad");
})

router.get("/fin/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query("UPDATE actividad_general SET fecha_fin = now() WHERE id = $1",[id]);
	res.redirect("/actividad");
})

router.get("/notas/add/:date",async (req,res)=>{
	const {date} = req.params;
  res.render("./notas/add", {date});
})

router.post("/add/:date", async(req,res)=>{
	const {date} = req.params;
	const {descripcion, fecha} =  req.body;
	const datos = {
		descripcion,
		fecha : date
	}
		if (datos.fecha == ""){
		datos.fecha = null;
	}

	await pool.query(`INSERT INTO notas (id, descripcion, fecha) VALUES (DEFAULT,$1,$2)`,
	[...Object.values(datos)])
	
	res.redirect("/actividad");
})

router.get("/notas/edit/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`SELECT id,descripcion,
										TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha
										FROM notas WHERE id =  $1`,[id])
  .then(result => {
    const Datos = result.rows[0];
    res.render("./notas/edit", {Datos:Datos});
  }).catch(err => {
    console.error(err);
  }); 
});

router.post("/notas/edit/:id",async (req,res)=>{
	const {id} = req.params;
	const {descripcion, fecha} = req.body;
	const datos = {
		descripcion,
		fecha,
		id : id
	};

		if (datos.fecha == ""){
		datos.fecha = null;
	}

	await pool.query('UPDATE notas SET descripcion = $1, fecha = $2 WHERE id = $3',[...Object.values(datos)])
	res.redirect("/actividad");
});

router.get("/notas/delete/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query('DELETE FROM notas WHERE id = $1',[id]);
	res.redirect("/actividad");
})


module.exports = router;