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
	res.render(`${gestion_tiempo_DV.tareas.add_plazo}`,{id,ido,idm});
});

router.post("/metas/tareas/add/fecha_plazo/:id/:ido/:idm",async (req,res)=>{
	const {id,ido,idm} = req.params;
	const {fecha_plazo} = req.body;

	await pool.query(`UPDATE tareas SET fecha_cumplimiento = $1 WHERE meta = $2 AND objetivos = $3 AND id = $4`,[fecha_plazo,idm,ido,id]);
	res.redirect("/gestion_tiempo/metas");
});








router.get("/metas/tareas/orden", async(req,res)=>{

	const tabla_metas_objetivos_tareas = await pool.query(`
			SELECT 
				tareas.id AS id_tareas,
				tareas.titulo AS T_titulo,
				tareas.fecha_fin AS T_fecha_fin,
				tareas.fecha_cumplimiento AS T_fecha_cumplimiento,
				TO_CHAR(tareas.fecha_cumplimiento, 'DD/MM/YYYY') AS fecha_cumplimiento_t,
				TO_CHAR(tareas.fecha_inicio, 'DD/MM/YYYY') AS fecha_inicio_t,
				TO_CHAR(tareas.fecha_fin, 'DD/MM/YYYY') AS fecha_fin_t,

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


	const horarios = await pool.query(`SELECT*FROM horarios ORDER BY titulo`);
	const Horarios = horarios.rows

	res.render(`${gestion_tiempo_DV.tareas.orden}`,{Tabla_metas_objetivos_tareas,gestion_tiempo_links,Horarios})
});















//&Horario

router.get("/horarios", async(req,res)=>{
	const horarios = await pool.query(`SELECT*FROM horarios ORDER BY titulo`);
	const Horarios = horarios.rows;

	const horario_registro = await pool.query(`SELECT*FROM horario_registro ORDER BY hora_inicio`);
	const Horario_registro = horario_registro.rows;
	res.render(`${gestion_tiempo_DV.horario.todos}`, {gestion_tiempo_links,Horarios,Horario_registro});
});

router.get("/horarios/add", async(req,res)=>{
	res.render(`${gestion_tiempo_DV.horario.add}`);
});

router.post("/horarios/add", async(req,res)=>{
	const {titulo,descripcion} = req.body;
	const datos = {
		titulo,
		descripcion
	};
await pool.query(`INSERT INTO horarios (
		id,
		titulo,
		descripcion,
		prioridad
		)

		VALUES
		(DEFAULT,$1,$2,NULL)`,[...Object.values(datos)]);

	res.redirect(gestion_tiempo_links.horario.index);
})

router.get("/horario/individual/:id", async(req,res)=>{
	const {id} = req.params;
	const datos = await pool.query(`SELECT*FROM horario_registro WHERE horario_id = $1 ORDER BY completada ASC,hora_inicio ASC `,[id]);
	const Datos = datos.rows;

	const validar_actividad = await pool.query(`SELECT  titulo_tarea,validar FROM actividad WHERE validar = true`)
	const Validar_actividad = validar_actividad.rows[0];

	let validacion_actividad="";
	let validacion_tarea="";

	if (Validar_actividad != undefined) {
		validacion_actividad = Validar_actividad.validar;
		validacion_tarea = Validar_actividad.titulo_tarea;
	}

	if (validacion_actividad != true) {
		validacion_actividad = true;
	}else{
		validacion_actividad = false;
	}

	const validar_tarea_terminada = await pool.query(`SELECT titulo,fecha_fin FROM tareas WHERE fecha_fin IS NOT NULL`);
	const Validar_tarea_terminada = validar_tarea_terminada.rows;


	res.render(`${gestion_tiempo_DV.horario.individual}`, {id, gestion_tiempo_links,Datos, validacion_actividad,validacion_tarea,Validar_tarea_terminada});
});

router.get("/horario/individual/add/:id", async(req,res)=>{
	const {id} = req.params;
	res.render(`${gestion_tiempo_DV.horario.add_tarea_ind}`, {id});
});

router.post("/horario/individual/add/:id", async(req,res)=>{
	let {id} = req.params;
	const{titulo, hora_inicio, hora_fin} = req.body;

	const datos = {
		titulo,
		hora_inicio,
		hora_fin,
		tipo_tarea:"tarea aparte",
		id
	};

	await pool.query(`INSERT INTO horario_registro (
		id,
		meta,
		objetivo,
		titulo_tarea,
		hora_inicio,
		hora_fin,
		tipo,
		completada,
		horario_id
		)

		VALUES
		(DEFAULT,NULL,NULL,$1,$2,$3,$4,false,$5);`,[...Object.values(datos)]);

	res.redirect(`${gestion_tiempo_links.horario.individual}/${datos.id}`);
});

router.post("/horario/add/tarea", async(req,res)=>{
	const{meta,objetivo,titulo, hora_inicio, hora_fin,id_horario, id_tarea} = req.body;
	const datos = {
		meta,
		objetivo,
		titulo,
		hora_inicio,
		hora_fin,
		tipo_tarea:"Tarea Meta",
		id_horario,
		id_tarea
	};

	await pool.query(`INSERT INTO horario_registro (
		id,
		meta,
		objetivo,
		titulo_tarea,
		hora_inicio,
		hora_fin,
		tipo,
		completada,
		horario_id,
		tarea_id
		)

		VALUES
		(DEFAULT,$1,$2,$3,$4,$5,$6,false,$7,$8);`,[...Object.values(datos)]);

	res.redirect(`${gestion_tiempo_links.tareas.orden}`);
});

router.get("/horario/individual/edit/:id", async (req,res)=>{
	const {id} = req.params;
	const datos = await pool.query(`SELECT*FROM horario_registro WHERE id = $1`,[id]);
	const  Datos = datos.rows[0];

	res.render(`${gestion_tiempo_DV.horario.edit_tarea_ind}`, {Datos, id});

});

router.post("/horario/individual_edit/:id", async (req,res)=>{
	const {id} = req.params;
	const {titulo,hora_inicio,hora_fin} = req.body;
	const datos = {
		titulo,
		hora_inicio,
		hora_fin,
		id
	}
	const horario = await pool.query(`SELECT id,horario_id FROM horario_registro WHERE id = $1`,[id]);
	const Horario = horario.rows[0];

	await pool.query(`UPDATE horario_registro SET titulo_tarea = $1 ,hora_inicio = $2, hora_fin = $3 WHERE id = $4`,[...Object.values(datos)])

	res.redirect(`${gestion_tiempo_links.horario.individual}/${Horario.horario_id}`);

});

router.get("/horario/individual/delet/:id", async (req,res)=>{
	const {id} = req.params;

	const horario = await pool.query(`SELECT id,horario_id FROM horario_registro WHERE id = $1`,[id]);
	const Horario = horario.rows[0];
	
	await pool.query(`DELETE FROM horario_registro WHERE id = $1`,[id]);

	res.redirect(`${gestion_tiempo_links.horario.individual}/${Horario.horario_id}`);
});

router.get("/horario/individual/confir/tarea/:id", async (req,res)=>{
	const {id} = req.params;

	await pool.query(`UPDATE horario_registro SET completada = true WHERE id = $1`,[id]);

	const horario = await pool.query(`SELECT id,horario_id FROM horario_registro WHERE id = $1`,[id]);
	const Horario = horario.rows[0];

	res.redirect(`${gestion_tiempo_links.horario.individual}/${Horario.horario_id}`);
});

router.get("/horario/individual/desconfir/tarea/:id", async (req,res)=>{
	const {id} = req.params;

	await pool.query(`UPDATE horario_registro SET completada = false WHERE id = $1`,[id]);

	const horario = await pool.query(`SELECT id,horario_id FROM horario_registro WHERE id = $1`,[id]);
	const Horario = horario.rows[0];

	res.redirect(`${gestion_tiempo_links.horario.individual}/${Horario.horario_id}`);
});

router.get("/horario/individual/confir/tarea_meta/:id_horario/:id_tarea", async (req,res)=>{
	const {id_horario, id_tarea} = req.params;

	await pool.query(`UPDATE horario_registro SET completada = true WHERE id = $1`,[id_horario]);
	await pool.query(`UPDATE tareas SET fecha_fin = now() WHERE id = $1`,[id_tarea]);

	const horario = await pool.query(`SELECT id,horario_id FROM horario_registro WHERE id = $1`,[id_horario]);
	const Horario = horario.rows[0];
	
	res.redirect(`${gestion_tiempo_links.horario.individual}/${Horario.horario_id}`);
});

router.get("/horario/individual/desconfir/tarea_meta/:id_horario/:id_tarea", async (req,res)=>{
	const {id_horario, id_tarea} = req.params;

	await pool.query(`UPDATE horario_registro SET completada = false WHERE id = $1`,[id_horario]);
	await pool.query(`UPDATE tareas SET fecha_fin = null WHERE id = $1`,[id_tarea]);

	const horario = await pool.query(`SELECT id,horario_id FROM horario_registro WHERE id = $1`,[id_horario]);
	const Horario = horario.rows[0];
	
	res.redirect(`${gestion_tiempo_links.horario.individual}/${Horario.horario_id}`);
});








//&Actividad
router.get("/actividad/registrar/:id", async (req,res)=>{
	const {id} = req.params;
	const horario_datos = await pool.query(`SELECT meta,objetivo,titulo_tarea,tipo,horario_id FROM horario_registro WHERE id = $1`,[id]);
	const Horario_datos = horario_datos.rows[0];

	await pool.query(`INSERT INTO actividad (
		id,
		meta,
		objetivo,
		titulo_tarea,
		fecha_inicio,
		fecha_fin,
		validar,
		tipo
		)

		VALUES
		(DEFAULT,$1,$2,$3,now(),NULL,true,$4);`,[
												Horario_datos.meta,
												Horario_datos.objetivo,
												Horario_datos.titulo_tarea,
												Horario_datos.tipo
												]);
	res.redirect(`${gestion_tiempo_links.horario.individual}/${Horario_datos.horario_id}`)
});

router.get("/actividad/finalizar/:id", async (req,res)=>{
	const {id} = req.params;
	const horario_datos = await pool.query(`SELECT horario_id FROM horario_registro WHERE id = $1`,[id]);
	const Horario_datos = horario_datos.rows[0];

	await pool.query(`UPDATE actividad SET fecha_fin = now(),validar = false WHERE validar = true`);
	res.redirect(`${gestion_tiempo_links.horario.individual}/${Horario_datos.horario_id}`)
});



module.exports = router;