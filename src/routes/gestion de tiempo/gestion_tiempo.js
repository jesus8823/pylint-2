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
	const metas = await pool.query(`SELECT *, 
									TO_CHAR(fecha_registro, 'DD/MM/YYYY') AS fecha_registro_t,
									TO_CHAR(fecha_inicio, 'DD/MM/YYYY') AS fecha_inicio_t,
									TO_CHAR(fecha_cumplimiento, 'DD/MM/YYYY') AS fecha_cumplimiento_texto_t,
									TO_CHAR(fecha_fin, 'DD/MM/YYYY') AS fecha_fin_t
										FROM metas
										ORDER BY fecha_fin DESC, fecha_cumplimiento ASC, fecha_inicio ASC;`
	);
	const Metas = metas.rows;

	const objetivos = await pool.query(`SELECT*,
										TO_CHAR(fecha_inicio, 'DD/MM/YYYY') AS fecha_inicio_t,
										TO_CHAR(fecha_cumplimiento, 'DD/MM/YYYY') AS fecha_cumplimiento_texto_t,
										TO_CHAR(fecha_fin, 'DD/MM/YYYY') AS fecha_fin_t
											FROM objetivos ORDER BY fecha_fin DESC, fecha_cumplimiento ASC, fecha_inicio ASC;`)
	const Objetivos = objetivos.rows;

	const tareas = await pool.query(`SELECT*,
									 TO_CHAR(fecha_inicio, 'DD/MM/YYYY') AS fecha_inicio_t,
									 TO_CHAR(fecha_cumplimiento, 'DD/MM/YYYY') AS fecha_cumplimiento_texto_t,
									 TO_CHAR(fecha_fin, 'DD/MM/YYYY') AS fecha_fin_t
										FROM tareas ORDER BY fecha_fin DESC, fecha_cumplimiento ASC;`)
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

	if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null
	}
	if (datos.fecha_plazo == ""){
		datos.fecha_plazo = null
	}

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
	res.redirect("/gestion_tiempo/metas");
})

router.get("/metas/edit/:id", async (req,res)=>{
	const  {id} = req.params;
	const datos = await pool.query(`SELECT*,
									TO_CHAR(fecha_inicio, 'YYYY-MM-DD"T"HH24:MI') AS fecha_inicio_f,
									TO_CHAR(fecha_cumplimiento, 'YYYY-MM-DD"T"HH24:MI') AS fecha_plazo_f,
									TO_CHAR(fecha_fin, 'YYYY-MM-DD"T"HH24:MI') AS fecha_fin_f
									FROM metas WHERE id = $1;`,[id]);
	const Datos = datos.rows[0];
	res.render(`${gestion_tiempo_DV.metas.edit}`, {Datos})
		
})

router.post("/metas/edit/:id",async(req,res)=>{
	const {id} = req.params;
		const {titulo,descripcion,fecha_inicio,fecha_plazo,fecha_fin} = req.body;

	const datos = {
		titulo,
		descripcion,
		fecha_inicio,
		fecha_plazo,
		fecha_fin,
		id
	};

	if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null
	}
	if (datos.fecha_plazo == ""){
		datos.fecha_plazo = null
	}
	if (datos.fecha_fin == ""){
		datos.fecha_fin = null
	}
	await pool.query(`UPDATE metas SET titulo = $1, descripcion = $2, fecha_inicio = $3, fecha_cumplimiento = $4, fecha_fin = $5 WHERE id = $6`,[...Object.values(datos)])
	res.redirect("/gestion_tiempo/metas");
})


router.get("/metas/add/fecha_inicio/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`UPDATE metas SET fecha_inicio = now() WHERE id = $1`,[id]);
	res.redirect("/gestion_tiempo/metas");
})

router.get("/metas/add/fecha_fin/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`UPDATE metas SET fecha_fin = now() WHERE id = $1`,[id]);
	res.redirect("/gestion_tiempo/metas");
})

router.get("/metas/add/fecha_plazo/:id",async (req,res)=>{
	const {id} = req.params;
	res.render(`${gestion_tiempo_DV.metas.add_plazo}`,{id})
});

router.post("/metas/add/fecha_plazo/:id",async (req,res)=>{
	const {id} = req.params;
	const {fecha_plazo} = req.body;


	await pool.query(`UPDATE metas SET fecha_cumplimiento = $1 WHERE id = $2`,[fecha_plazo,id])
	res.redirect("/gestion_tiempo/metas");
});








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
	if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null

	}
	if (datos.fecha_plazo == ""){
		datos.fecha_plazo = null
	}

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
	res.redirect("/gestion_tiempo/metas");
});


router.get("/metas/objetivos/edit/:id", async (req,res)=>{
	const  {id} = req.params;
	const datos = await pool.query(`SELECT*,
									TO_CHAR(fecha_inicio, 'YYYY-MM-DD"T"HH24:MI') AS fecha_inicio_f,
									TO_CHAR(fecha_cumplimiento, 'YYYY-MM-DD"T"HH24:MI') AS fecha_plazo_f,
									TO_CHAR(fecha_fin, 'YYYY-MM-DD"T"HH24:MI') AS fecha_fin_f
									FROM objetivos WHERE id = $1;`,[id]);
	const Datos = datos.rows[0];
	res.render(`${gestion_tiempo_DV.objetivos.edit}`, {Datos})
		
});

router.post("/metas/objetivos/edit/:id",async(req,res)=>{
	const {id} = req.params;
		const {titulo,descripcion,fecha_inicio,fecha_plazo,fecha_fin} = req.body;

	const datos = {
		titulo,
		descripcion,
		fecha_inicio,
		fecha_plazo,
		fecha_fin,
		id
	};

	if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null
	}
	if (datos.fecha_plazo == ""){
		datos.fecha_plazo = null
	}
	if (datos.fecha_fin == ""){
		datos.fecha_fin = null
	}
	await pool.query(`UPDATE objetivos SET titulo = $1, descripcion = $2, fecha_inicio = $3, fecha_cumplimiento = $4, fecha_fin = $5 WHERE id = $6`,[...Object.values(datos)])
	res.redirect("/gestion_tiempo/metas");
});






router.get("/metas/objetivos/add/fecha_inicio/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`UPDATE objetivos SET fecha_inicio = now() WHERE id = $1`,[id]);
	res.redirect("/gestion_tiempo/metas");
});

router.get("/metas/objetivos/add/fecha_fin/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`UPDATE objetivos SET fecha_fin = now() WHERE id = $1`,[id]);
	res.redirect("/gestion_tiempo/metas");
});

router.get("/metas/objetivos/add/fecha_plazo/:id",async (req,res)=>{
	const {id} = req.params;
	res.render(`${gestion_tiempo_DV.objetivos.add_plazo}`,{id})
});

router.post("/metas/objetivos/add/fecha_plazo/:id",async (req,res)=>{
	const {id} = req.params;
	const {fecha_plazo} = req.body;

	await pool.query(`UPDATE objetivos SET fecha_cumplimiento = $1 WHERE id = $2`,[fecha_plazo,id])
	res.redirect("/gestion_tiempo/metas");
});












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
	if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null
	}
	if (datos.fecha_plazo == ""){
		datos.fecha_plazo = null
	}

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

router.get("/metas/tareas/edit/:idt/:ido", async (req,res)=>{
	const  {idt,ido} = req.params;
	const datos = await pool.query(`SELECT*,
									TO_CHAR(fecha_inicio, 'YYYY-MM-DD"T"HH24:MI') AS fecha_inicio_f,
									TO_CHAR(fecha_cumplimiento, 'YYYY-MM-DD"T"HH24:MI') AS fecha_plazo_f,
									TO_CHAR(fecha_fin, 'YYYY-MM-DD"T"HH24:MI') AS fecha_fin_f
									FROM tareas WHERE id = $1 AND objetivos = $2;`,[idt,ido]);
	const Datos = datos.rows[0];
	res.render(`${gestion_tiempo_DV.tareas.edit}`, {Datos,idt,ido})
		
});

router.post("/metas/objetivos/edit/:idt/:ido",async(req,res)=>{
	const {idt,ido} = req.params;
		const {titulo,descripcion,fecha_inicio,fecha_plazo,fecha_fin} = req.body;

	const datos = {
		titulo,
		descripcion,
		fecha_inicio,
		fecha_plazo,
		fecha_fin,
		idt,
		ido
	};

	if (datos.fecha_inicio == ""){
		datos.fecha_inicio = null
	}
	if (datos.fecha_plazo == ""){
		datos.fecha_plazo = null
	}
	if (datos.fecha_fin == ""){
		datos.fecha_fin = null
	}
	await pool.query(`UPDATE tareas 
					  SET titulo = $1, descripcion = $2, fecha_inicio = $3, fecha_cumplimiento = $4, fecha_fin = $5 
					  WHERE id = $6 AND objetivos = $7;`,[...Object.values(datos)])
	res.redirect("/gestion_tiempo/metas");
});




router.get("/metas/tareas/add/fecha_inicio/:id/:ido/:idm", async(req,res)=>{
	const {id,ido,idm} = req.params;
	await pool.query(`UPDATE tareas SET fecha_inicio = now() WHERE meta = $1 AND objetivos = $2 AND id = $3`,[idm,ido,id]);
	res.redirect("/gestion_tiempo/metas");
});

router.get("/metas/tareas/add/fecha_fin/:id/:ido/:idm", async(req,res)=>{
	const {id,ido,idm} = req.params;
	await pool.query(`UPDATE tareas SET fecha_fin = now() WHERE meta = $1 AND objetivos = $2 AND id = $3`,[idm,ido,id]);
	res.redirect("/gestion_tiempo/metas");
});

router.get("/metas/tareas/add/fecha_plazo/:id/:ido/:idm",async (req,res)=>{
	const {id,ido,idm} = req.params;
	res.render(`${gestion_tiempo_DV.tareas.add_plazo}`,{id,ido,idm})
});

router.post("/metas/tareas/add/fecha_plazo/:id/:ido/:idm",async (req,res)=>{
	const {id,ido,idm} = req.params;
	const {fecha_plazo} = req.body;
	console.log(fecha_plazo)

	await pool.query(`UPDATE tareas SET fecha_cumplimiento = $1 WHERE meta = $2 AND objetivos = $3 AND id = $4`,[fecha_plazo,idm,ido,id]);
	res.redirect("/gestion_tiempo/metas");
});




router.get("/metas/tareas/orden", async(req,res)=>{

	const tabla_metas_objetivos_tareas = await pool.query(`
			SELECT 
				tareas.titulo AS T_titulo,
				tareas.fecha_fin AS T_fecha_fin,
				tareas.fecha_cumplimiento AS T_fecha_cumplimiento,
				TO_CHAR(tareas.fecha_cumplimiento, 'DD/MM/YYYY') AS fecha_cumplimiento_t,

				tareas.objetivos AS id_objetivos,
				tareas.meta AS id_metas,

				objetivos.id AS id_objetivos,
				objetivos.titulo AS O_titulo,

				metas.id AS id_metas,
				metas.titulo AS M_titulo

					FROM tareas

				JOIN objetivos ON tareas.objetivos = objetivos.id
				JOIN metas ON tareas.meta = metas.id

				WHERE tareas.fecha_fin IS NULL
				ORDER BY tareas.fecha_cumplimiento ASC;
		`)
	const Tabla_metas_objetivos_tareas = tabla_metas_objetivos_tareas.rows;



	res.render(`${gestion_tiempo_DV.tareas.orden}`,{Tabla_metas_objetivos_tareas})
});;


module.exports = router;