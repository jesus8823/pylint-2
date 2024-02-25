
                                  // Trabajos

document.getElementById('trabajo_nombre_input').addEventListener('focus', function () {
    const elemento = document.getElementById('contenedor_busqueda_1');
    elemento.style.display = 'flex'
});

  document.getElementById('busqueda_quitar_1').addEventListener('click', function () {
    const elemento = document.getElementById('contenedor_busqueda_1');
    elemento.style.display = 'none'
  });

  // Etiqueta Filtro
 document.getElementById('filtro_trabajo').addEventListener('keyup', function () {
    const filtro = this.value.toLowerCase();
    const listaElementos = document.getElementById('contenedor_elementos_filtro_trabajo');
    const elementos = listaElementos.getElementsByTagName('div');
    // console.log(listaElementos[0]);

    for (let i = 0; i < elementos.length; i++) {
      const textoElemento = elementos[i].textContent.toLowerCase();

      if (textoElemento.includes(filtro)) {
        elementos[i].style.display = 'block';
      } else {
        elementos[i].style.display = 'none';
      }
    }
  });


 // Trabajos imprimir dato seleccionado en input
function imprimir_dato_etiqueta(id){
  const datos = document.getElementById(`trabajo_${id}`);
  

  const id_trabajo = datos.querySelector('p');
    const Id_trabajo = id_trabajo.textContent;

    // Obtener el elemento <h4> dentro del div
    const nombre_trabajo = datos.querySelector('h4');
    const Nombre_trabajo = nombre_trabajo.textContent;

    const trabajo_id_input = document.getElementById(`trabajo_id_input`);
    trabajo_id_input.value = Id_trabajo;
    const trabajo_nombre_input = document.getElementById(`trabajo_nombre_input`);
    trabajo_nombre_input.value = Nombre_trabajo;

     const elemento = document.getElementById('contenedor_busqueda_1');
    elemento.style.display = 'none'
};




                              // Etiquetas_trabajo




document.getElementById('etiqueta_trabajo_nombre_input').addEventListener('focus', function () {
  const trabajo_input = document.getElementById('trabajo_nombre_input');
  const trabajo_input_value = trabajo_input.value;

  if (trabajo_input_value == "") {
    console.log("Debe Seleccionar un trabajo para continuar")
  }else{
    const elemento = document.getElementById('contenedor_busqueda_11');
    elemento.style.display = 'flex'
  }

});

  document.getElementById('busqueda_quitar_11').addEventListener('click', function () {
    const elemento = document.getElementById('contenedor_busqueda_11');
    elemento.style.display = 'none'
  });

  // Etiquetas Filtro
 document.getElementById('filtro_etiqueta_trabajo').addEventListener('keyup', function () {
    const filtro = this.value.toLowerCase();
    const listaElementos = document.getElementById('contenedor_elementos_filtro_etiqueta_trabajo');
    const elementos = listaElementos.getElementsByTagName('div');
    // console.log(listaElementos[0]);

    for (let i = 0; i < elementos.length; i++) {
      const textoElemento = elementos[i].textContent.toLowerCase();

      if (textoElemento.includes(filtro)) {
        elementos[i].style.display = 'block';
      } else {
        elementos[i].style.display = 'none';
      }
    }
  });


 // Trabajos imprimir dato seleccionado en input
function imprimir_dato_etiqueta(id){
  const datos = document.getElementById(`etiqueta_trabajo_${id}`);
  console.log(datos)

  const id_etiqueta_trabajo = datos.querySelector('p');
    const Id_etiqueta_trabajo = id_etiqueta_trabajo.textContent;

    // Obtener el elemento <h4> dentro del div
    const nombre_etiqueta_trabajo = datos.querySelector('h4');
    const Nombre_etiqueta_trabajo = nombre_etiqueta_trabajo.textContent;

    const etiqueta_trabajo_id_input = document.getElementById(`etiqueta_trabajo_id_input`);
    etiqueta_trabajo_id_input.value = Id_etiqueta_trabajo;
    const etiqueta_trabajo_nombre_input = document.getElementById(`etiqueta_trabajo_nombre_input`);
    etiqueta_trabajo_nombre_input.value = Nombre_etiqueta_trabajo;

     const elemento = document.getElementById('contenedor_busqueda_11');
    elemento.style.display = 'none'
};






                                    // Bancos

document.getElementById('banco_nombre_input').addEventListener('focus', function () {
    const elemento = document.getElementById('contenedor_busqueda_2');
    elemento.style.display = 'flex'
});

  document.getElementById('busqueda_quitar_2').addEventListener('click', function () {
    const elemento = document.getElementById('contenedor_busqueda_2');
    elemento.style.display = 'none'
  });

  // Etiquetas Filtro
 document.getElementById('filtro_bancos').addEventListener('keyup', function () {
    const filtro = this.value.toLowerCase();
    const listaElementos = document.getElementById('contenedor_elementos_filtro_bancos');
    const elementos = listaElementos.getElementsByTagName('div');
    // console.log(listaElementos[0]);

    for (let i = 0; i < elementos.length; i++) {
      const textoElemento = elementos[i].textContent.toLowerCase();

      if (textoElemento.includes(filtro)) {
        elementos[i].style.display = 'block';
      } else {
        elementos[i].style.display = 'none';
      }
    }
  });

 // Etiquetas imprimir dato seleccionado en input
function imprimir_dato_banco(id){
  const datos_banco = document.getElementById(`banco_${id}`);
  

  const id_banco = datos_banco.querySelector('p');
    const Id_banco = id_banco.textContent;

    // Obtener el elemento <h4> dentro del div
    const nombre_banco = datos_banco.querySelector('h4');
    const Nombre_banco = nombre_banco.textContent;

    const banco_id_input = document.getElementById(`banco_id_input`);
    banco_id_input.value = Id_banco;
    const banco_nombre_input = document.getElementById(`banco_nombre_input`);
    banco_nombre_input.value = Nombre_banco;

     const elemento = document.getElementById('contenedor_busqueda_2');
    elemento.style.display = 'none'
};



                                    // Tipo de Monto

document.getElementById('tipo_dinero_nombre_input').addEventListener('focus', function () {
    const elemento = document.getElementById('contenedor_busqueda_3');
    elemento.style.display = 'flex'
});

  document.getElementById('busqueda_quitar_3').addEventListener('click', function () {
    const elemento = document.getElementById('contenedor_busqueda_3');
    elemento.style.display = 'none'
  });

  // Etiquetas Filtro
 document.getElementById('filtro_tipo_dinero').addEventListener('keyup', function () {
    const filtro = this.value.toLowerCase();
    const listaElementos = document.getElementById('contenedor_elementos_filtro_tipo_dinero');
    const elementos = listaElementos.getElementsByTagName('div');
    // console.log(listaElementos[0]);

    for (let i = 0; i < elementos.length; i++) {
      const textoElemento = elementos[i].textContent.toLowerCase();

      if (textoElemento.includes(filtro)) {
        elementos[i].style.display = 'block';
      } else {
        elementos[i].style.display = 'none';
      }
    }
  });

 // Etiquetas imprimir dato seleccionado en input
function imprimir_dato_tipo_dinero(id){
  const datos_tipo_dinero = document.getElementById(`tipo_dinero_${id}`);
  

  const id_tipo_dinero = datos_tipo_dinero.querySelector('p');
    const Id_tipo_dinero = id_tipo_dinero.textContent;

    // Obtener el elemento <h4> dentro del div
    const nombre_tipo_dinero = datos_tipo_dinero.querySelector('h4');
    const Nombre_tipo_dinero = nombre_tipo_dinero.textContent;

    const tipo_dinero_id_input = document.getElementById(`tipo_dinero_id_input`);
    tipo_dinero_id_input.value = Id_tipo_dinero;
    const tipo_dinero_nombre_input = document.getElementById(`tipo_dinero_nombre_input`);
    tipo_dinero_nombre_input.value = Nombre_tipo_dinero;

     const elemento = document.getElementById('contenedor_busqueda_3');
    elemento.style.display = 'none'
};