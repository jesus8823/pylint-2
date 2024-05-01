const handlebars = require('handlebars');

function eqHelper(a, b, options) {
  if ((a === b) || (a === "" && (b === null || b === undefined))) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}

function neqHelper(a, b, options) {
  if (!eqHelper(a, b, options)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}

function mayor_menor(a, num, options) {
  // if (typeof a === "number" && typeof num === "number") {
    if (a > num) {
      return options.fn(this); // a es mayor que num
    } else if (a < num) {
      return options.inverse(this); // a es menor que num
    }
  }
  // return options.inverse(this); // En caso de que los argumentos no sean números o sean iguales
// }


// Helper para calcular la suma de una lista de números
handlebars.registerHelper('suma', function (...args) {
  const numeros = args.map(Number);
  const suma = numeros.reduce((total, numero) => total + numero, 0);
  return suma;
});


handlebars.registerHelper('toFixed', function (number, decimals) {
    return parseFloat(number).toFixed(decimals);
  });

handlebars.registerHelper('multiply', function (num1, num2) {
    return num1 * num2;
  });

handlebars.registerHelper('formatNumber', function (value) {
  const parts = value.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  const integerFormatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedNumber = decimalPart.length > 0 ? integerFormatted + '.' + decimalPart : integerFormatted;

  return formattedNumber;
});

handlebars.registerHelper('eq', eqHelper);
handlebars.registerHelper('neq', neqHelper);
handlebars.registerHelper('mayor_menor', mayor_menor);


handlebars.registerHelper('validarTitulo', function(titulo, array, options) {
    if (!array || !Array.isArray(array)) {
        return options.inverse(this);
    }

    const encontrado = array.find(objeto => objeto && objeto.titulo === titulo);
    if (encontrado) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

module.exports = handlebars;