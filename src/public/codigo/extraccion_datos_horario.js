const horario_extraer_datos = (id, titulo)=>{
	//datos
    let meta_dato = document.getElementById(`horario_datos_extraccion_meta(${id})`).textContent;
    let objetivo_dato = document.getElementById(`horario_datos_extraccion_objetivo(${id})`).textContent;
    // let titulo_dato = document.getElementById(`horario_datos_extraccion_titulo(${id})`).textContent;
    // let titulo_convertido = titulo_dato.split(" ");

    //inputs
    let input_meta_horario = document.getElementById(`input_meta_horario`);
    let input_objetivo_horario = document.getElementById(`input_objetivo_horario`);
    let input_titulo_horario = document.getElementById(`input_titulo_horario`);

    input_meta_horario.value = meta_dato;
    input_objetivo_horario.value = objetivo_dato;
    input_titulo_horario.value = titulo;
}

const extraer_id_horario = (id)=>{

	//input
	const input_id = document.getElementById(`input_id_horario`);
	input_id.value = id;

}