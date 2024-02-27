const express = require("express");
const router = express.Router();

const XlsxPopulate = require('xlsx-populate');
const path = require("path");

const {finanzas_links} = require("../../config/links");
const {finanzas_DV} = require("../../config/direcciones_views");
const pool = require("../../database");



																					// &Registros

router.get("/",async (req,res)=>{
	const datos = await pool.query(`SELECT 
									finanzas.id AS finanzas_id,
									finanzas.descripcion,
									finanzas.etiquetas_gastos,
									finanzas.banco,
									finanzas.control_ingreso_egreso,
									finanzas.trabajo,
									finanzas.etiquetas_trabajos,
									finanzas.dinero,
									finanzas.finanzas_tipo_dinero,
									finanzas.dinero_actual,
									finanzas.dinero_banco,
									finanzas.fecha,
									TO_CHAR(finanzas.fecha, 'DD-MM-YYYY HH24:MI') AS fecha_finanzas,
									finanzas.fecha,

									trabajos.id AS trabajo_id,
									trabajos.nombre AS trabajo_nombre,

									finanzas_etiquetas.id AS etiquetas_ids,
									finanzas_etiquetas.nombre AS etiquetas_nombre,

									finanzas_bancos.id AS bancos_ids,
									finanzas_bancos.nombre AS bancos_nombre,
									
									finanzas_tipo_dinero.id AS tipo_dinero_ids,
									finanzas_tipo_dinero.nombre AS tipo_dinero_nombre,
									finanzas_tipo_dinero.simbolo AS tipo_dinero_simbolo,
									finanzas_tipo_dinero.color AS tipo_dinero_color

									FROM finanzas
									LEFT JOIN trabajos ON finanzas.trabajo = trabajos.id
									LEFT JOIN finanzas_etiquetas ON finanzas.etiquetas_gastos = finanzas_etiquetas.id
									LEFT JOIN finanzas_bancos ON finanzas.banco = finanzas_bancos.id
									LEFT JOIN finanzas_tipo_dinero ON finanzas.finanzas_tipo_dinero = finanzas_tipo_dinero.id
									ORDER BY finanzas.fecha DESC, finanzas_id DESC`);
	const Datos = datos.rows;
	res.render(`${finanzas_DV.registros.index}` ,{Datos, finanzas_links});
})

router.get("/calcular_dinero",async(req,res)=>{

	const array_tipo_dinero_db = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC`);
	const Array_Tipo_Dinero_DB = array_tipo_dinero_db.rows;

	const array_bancos_db = await pool.query(`SELECT*FROM finanzas_bancos ORDER BY posicion ASC`);
	const Array_Bancos_DB = array_bancos_db.rows;


	let dinero_actualizado = {};
	let dinero_banco_actual = {};


	for (let i = 0; i < Array_Tipo_Dinero_DB.length; i++) {
		const array = await pool.query(`SELECT id,dinero,fecha,dinero_actual,finanzas_tipo_dinero FROM finanzas WHERE finanzas_tipo_dinero = $1 ORDER BY fecha ASC, id ASC`,[Array_Tipo_Dinero_DB[i].id])
		const Array_Datos = array.rows;

		const Tipo_Dinero = Array_Tipo_Dinero_DB[i].simbolo;

	for (let i = 0; i < Array_Datos.length; i++) {
		let registro_anterior = i - 1;

			if (dinero_actualizado.hasOwnProperty(Tipo_Dinero)) {
			} else {
			  dinero_actualizado[Tipo_Dinero] = [];
			}

			if (registro_anterior >= 0){
					const result = Number(Array_Datos[i].dinero) + Number(dinero_actualizado[Tipo_Dinero][registro_anterior]);
					dinero_actualizado[Tipo_Dinero].push(result);
					await pool.query(`UPDATE finanzas SET dinero_actual = $1 WHERE id = $2`,[result,Array_Datos[i].id]);


					
				}else{
					const result = Number(Array_Datos[i].dinero);
					dinero_actualizado[Tipo_Dinero].push(result);
					await pool.query(`UPDATE finanzas SET dinero_actual = $1 WHERE id = $2`,[result,Array_Datos[i].id]);
				}	

				
	}
}

for (let i = 0; i < Array_Bancos_DB.length; i++) {
	const banco = Array_Bancos_DB[i];
	

	for (let i = 0; i < Array_Tipo_Dinero_DB.length; i++) {
			const array = await pool.query(`SELECT id,dinero,fecha,dinero_actual,finanzas_tipo_dinero,banco FROM finanzas WHERE finanzas_tipo_dinero = $1 AND banco = $2 ORDER BY fecha ASC, id ASC`,[Array_Tipo_Dinero_DB[i].id,banco.id])
			const Array_Datos = array.rows;

			const Tipo_Dinero = Array_Tipo_Dinero_DB[i].simbolo;
			

		for (let i = 0; i < Array_Datos.length; i++) {
			let registro_anterior = i - 1;

				if (dinero_banco_actual.hasOwnProperty(banco.nombre)) {
				} else {
				  dinero_banco_actual[banco.nombre] = {};
				}

				if (dinero_banco_actual[banco.nombre].hasOwnProperty(Tipo_Dinero)) {
				} else {
				  dinero_banco_actual[banco.nombre][Tipo_Dinero] = [];
				}

				

				if (registro_anterior >= 0){
						const result = Number(Array_Datos[i].dinero) + Number(dinero_banco_actual[banco.nombre][Tipo_Dinero][registro_anterior]);
						dinero_banco_actual[banco.nombre][Tipo_Dinero].push(result);
						await pool.query(`UPDATE finanzas SET dinero_banco = $1 WHERE id = $2`,[result,Array_Datos[i].id]);


						
					}else{
						const result = Number(Array_Datos[i].dinero);

						dinero_banco_actual[banco.nombre][Tipo_Dinero].push(result);
						await pool.query(`UPDATE finanzas SET dinero_banco = $1 WHERE id = $2`,[result,Array_Datos[i].id]);
					}		
		}
	}
}
	res.redirect(`${finanzas_links.registros.inicio}`);

})

router.get("/imprimir_excel", async(req,res)=>{
	async function exportarDatosExcel() {

    // Realiza una consulta para obtener los datos de la base de datos
    const tabla = await pool.query(`SELECT 
									finanzas.id AS finanzas_id,
									finanzas.descripcion,
									finanzas.etiqueta AS etiqueta_id,
									finanzas.banco AS banco_id,
									finanzas.dinero,
									finanzas.finanzas_tipo_dinero AS tipo_dinero_id,
									finanzas.dinero_actual,
									finanzas.dinero_banco,
									TO_CHAR(finanzas.fecha, 'DD-MM-YYYY') AS fecha_finanzas,
									finanzas.fecha,

									finanzas_etiquetas.id AS etiquetas_ids,
									finanzas_etiquetas.nombre AS etiquetas_nombre,

									finanzas_bancos.id AS bancos_ids,
									finanzas_bancos.nombre AS bancos_nombre,
									
									finanzas_tipo_dinero.id AS tipo_dinero_ids,
									finanzas_tipo_dinero.nombre AS tipo_dinero_nombre,
									finanzas_tipo_dinero.simbolo AS tipo_dinero_simbolo,
									finanzas_tipo_dinero.color AS tipo_dinero_color

									FROM finanzas 
									RIGHT JOIN finanzas_etiquetas ON finanzas.etiqueta = finanzas_etiquetas.id
									RIGHT JOIN finanzas_bancos ON finanzas.banco = finanzas_bancos.id
									RIGHT JOIN finanzas_tipo_dinero ON finanzas.finanzas_tipo_dinero = finanzas_tipo_dinero.id
									ORDER BY fecha DESC, finanzas_id DESC`);
    const rows = tabla.rows;

    // Crea un nuevo libro de Excel
    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    // Escribe los encabezados de las columnas
    sheet.cell('A1').value('Descripcion');
    sheet.cell('B1').value('Etiqueta');
    sheet.cell('C1').value('Dinero');
    sheet.cell('D1').value('Fecha');

    // Escribe los datos en el archivo Excel
    rows.forEach((row, index) => {
    	const dinero = row.dinero;
    	// let cantidad_medida_minima_bodega = row.cantidad_medida_minima_bodega;
    	
    	// if(cantidad_medida_minima_bodega == null){
    	// 	cantidad_medida_minima_bodega = 0;
    	// }
			const dinero_str = dinero.toString();

			const dinero_format = dinero_str.replace(".", ",");

      sheet.cell(`A${index + 2}`).value(row.descripcion);
      sheet.cell(`B${index + 2}`).value(row.etiquetas_nombre);
      sheet.cell(`C${index + 2}`).value(dinero_format);
      sheet.cell(`D${index + 2}`).value(row.fecha_finanzas);
})
    // Definir una ruta del archivo
 const direccion = path.join(__dirname, "../public/Archivos Excel/Registros_Datos.xlsx");

    await workbook.toFileAsync(direccion);

  //   console.log('Datos exportados exitosamente a un archivo Excel.');
  // } catch (error) {
  //   console.error('Error al exportar los datos:', error);
  // } finally {
  res.download(direccion);
}
	exportarDatosExcel();
	// res.redirect("/finanzas/registros");
})

router.get("/add", async (req,res)=>{
	res.render(`${finanzas_DV.registros.add}`, {finanzas_links})
})

router.get("/add/ingresos", async (req,res)=>{

	const trabajos = await pool.query(`SELECT*FROM trabajos ORDER BY nombre ASC`);
	const Trabajos = trabajos.rows;	

	const etiquetas_trabajos = await pool.query(`SELECT*FROM etiquetas_trabajos ORDER BY nombre ASC`);
	const Etiquetas_trabajos = etiquetas_trabajos.rows;

	const bancos = await pool.query(`SELECT*FROM finanzas_bancos ORDER BY posicion ASC`);
	const Bancos = bancos.rows;

	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC`);
	const Tipo_Dinero = tipo_dinero.rows;

	res.render(`${finanzas_DV.registros.add_ingresos}`,{Bancos, Tipo_Dinero, Trabajos, Etiquetas_trabajos, finanzas_links})
})

router.post("/add/registros", async (req,res)=>{
	const {
		descripcion_registros,

		id_etiqueta_registros,
		etiqueta_registros,

		monto,

		id_tipo_monto_registros,
		tipo_monto_registros,

		id_banco_registros,
		banco_registros,

		id_control_registros,
		control_registros,

		id_lista_registros,
		lista_registros,

		fecha

	} = req.body;
	const datos = {
		descripcion_registros,
		id_etiqueta_registros,
		id_banco_registros,
		id_control_registros,
		id_lista_registros,
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
		etiqueta,
		banco,
		control_dinero,
		finanzas_lista_compras,
		dinero,
		finanzas_tipo_dinero,
		dinero_actual,
		fecha)

		VALUES
		(DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8,$9)`,[...Object.values(datos)])


	res.redirect("/finanzas/registros/calcular_dinero")
})


router.get("/edit/registros/:id", async(req,res)=>{
	const {id} = req.params;
	const etiquetas = await pool.query(`SELECT*FROM finanzas_etiquetas ORDER BY posicion ASC`);
	const Etiquetas = etiquetas.rows;

	const bancos = await pool.query(`SELECT*FROM finanzas_bancos ORDER BY posicion ASC`);
	const Bancos = bancos.rows;

	const tipo_dinero = await pool.query(`SELECT*FROM finanzas_tipo_dinero ORDER BY posicion ASC`);
	const Tipo_Dinero = tipo_dinero.rows;

	const datos = await pool.query(`SELECT 
									finanzas.id AS finanzas_id,
									finanzas.descripcion,
									finanzas.etiquetas_gastos,
									finanzas.banco,
									finanzas.control_ingreso_egreso,
									finanzas.trabajo,
									finanzas.etiquetas_trabajos,
									finanzas.dinero,
									finanzas.finanzas_tipo_dinero,
									finanzas.dinero_actual,
									finanzas.dinero_banco,
									finanzas.fecha,
									TO_CHAR(finanzas.fecha, 'DD-MM-YYYY HH24:MI') AS fecha_finanzas,
									TO_CHAR(finanzas.fecha, 'YYYY-MM-DD HH24:MI') AS fecha_finanzas_adaptada,
									finanzas.fecha,

									trabajos.id AS trabajo_id,
									trabajos.nombre AS trabajo_nombre,

									etiquetas_trabajos.id AS etiqueta_trabajo_id,
									etiquetas_trabajos.nombre AS etiqueta_trabajo_nombre,

									finanzas_etiquetas.id AS etiquetas_ids,
									finanzas_etiquetas.nombre AS etiquetas_nombre,

									finanzas_bancos.id AS bancos_ids,
									finanzas_bancos.nombre AS bancos_nombre,
									
									finanzas_tipo_dinero.id AS tipo_dinero_ids,
									finanzas_tipo_dinero.nombre AS tipo_dinero_nombre,
									finanzas_tipo_dinero.simbolo AS tipo_dinero_simbolo,
									finanzas_tipo_dinero.color AS tipo_dinero_color

									FROM finanzas
									LEFT JOIN trabajos ON finanzas.trabajo = trabajos.id
									LEFT JOIN etiquetas_trabajos ON finanzas.etiquetas_trabajos = etiquetas_trabajos.id
									LEFT JOIN finanzas_etiquetas ON finanzas.etiquetas_gastos = finanzas_etiquetas.id
									LEFT JOIN finanzas_bancos ON finanzas.banco = finanzas_bancos.id
									LEFT JOIN finanzas_tipo_dinero ON finanzas.finanzas_tipo_dinero = finanzas_tipo_dinero.id
									WHERE finanzas.id = $1 ORDER BY fecha DESC`,[id]);
	const Datos = datos.rows[0];
	res.render("./finanzas/registros/edit_registros",{Etiquetas, Bancos, Tipo_Dinero})
})

router.post("/edit/registros/:id", async(req,res)=>{
	const {id} = req.params;
	const {
		descripcion_registros,
		id_etiqueta_registros,
		monto,
		id_tipo_monto_registros,
		tipo_monto_registros,
		id_banco_registros,
		id_control_registros,
		id_lista_registros,
		fecha
	} = req.body;
	
	const datos = {
		descripcion_registros,
		id_etiqueta_registros,
		id_banco_registros,
		id_control_registros,
		id_lista_registros,
		monto,
		id_tipo_monto_registros,
		fecha,
		id: id
	};
	if (datos.id_control_registros == "") {
		datos.id_control_registros = null;
	}
	if (datos.id_lista_registros == ""){
		datos.id_lista_registros = null;
	}


	await pool.query(`UPDATE finanzas SET 
	descripcion = $1,
	etiqueta = $2,
	banco = $3,
	control_dinero = $4,
	finanzas_lista_compras = $5,
	dinero = $6,
	finanzas_tipo_dinero = $7,
	fecha = $8
	WHERE id = $9`, [...Object.values(datos)])
	res.redirect("/finanzas/registros/calcular_dinero");
});

router.get("/elim/registros/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query(`DELETE FROM finanzas WHERE id = $1;`,[id])
	res.redirect("/finanzas/registros/calcular_dinero");
});

module.exports = router;