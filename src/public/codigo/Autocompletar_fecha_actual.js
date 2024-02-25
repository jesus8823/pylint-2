var fecha_inicio_input = document.getElementById("fecha_inicio");

  // Obtener la fecha y hora actuales
  var fecha_actual = new Date();
  console.log(fecha_actual);

// Obtener componentes de fecha y hora
var año = fecha_actual.getFullYear();
var mes = ('0' + (fecha_actual.getMonth() + 1)).slice(-2); // Sumar 1 porque los meses comienzan desde 0
var dia = ('0' + fecha_actual.getDate()).slice(-2);
var horas = ('0' + fecha_actual.getHours()).slice(-2);
var minutos = ('0' + fecha_actual.getMinutes()).slice(-2);

// Formatear la fecha y hora en el formato esperado por <input type="datetime-local">
var formatear_fecha = `${año}-${mes}-${dia}T${horas}:${minutos}`;
console.log('Fecha y hora formateada:', formatear_fecha);

  // Establecer el valor del campo de entrada con la fecha y hora actuales
  fecha_inicio_input.value = formatear_fecha;