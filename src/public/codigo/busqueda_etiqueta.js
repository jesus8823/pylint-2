




                                  // etiquetas

document.getElementById('etiquta_nombre_input').addEventListener('focus', function () {
    const elemento = document.getElementById('contenedor_busqueda_1');
    elemento.style.display = 'flex'
});

  document.getElementById('busqueda_quitar_1').addEventListener('click', function () {
    const elemento = document.getElementById('contenedor_busqueda_1');
    elemento.style.display = 'none'
  });

  // Etiquetas Filtro
 document.getElementById('filtro_etiquetas').addEventListener('keyup', function () {
    const filtro = this.value.toLowerCase();
    const listaElementos = document.getElementById('contenedor_elementos_filtro_etiquetas');
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
function imprimir_dato_etiqueta(id){
  const datos = document.getElementById(`etiqueta_${id}`);
  

  const id_etiqueta = datos.querySelector('p');
    const Id_etiqueta = id_etiqueta.textContent;

    // Obtener el elemento <h4> dentro del div
    const nombre_etiqueta = datos.querySelector('h4');
    const Nombre_etiqueta = nombre_etiqueta.textContent;

    const etiquta_id_input = document.getElementById(`etiquta_id_input`);
    etiquta_id_input.value = Id_etiqueta;
    const etiquta_nombre_input = document.getElementById(`etiquta_nombre_input`);
    etiquta_nombre_input.value = Nombre_etiqueta;

     const elemento = document.getElementById('contenedor_busqueda_1');
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