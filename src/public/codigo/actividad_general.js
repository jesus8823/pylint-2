
const btn_config = document.getElementById('btn_config');
const elementos = document.getElementsByClassName('select_config');

function hidden_elementos_btn_config() {
  for (let i = 0; i < elementos.length; i++) {
    const elemento = elementos[i];
    if (elemento.hasAttribute('hidden')) {
      elemento.removeAttribute('hidden');
    } else {
      elemento.setAttribute('hidden', '');
    }
  }
}

btn_config.addEventListener('click', hidden_elementos_btn_config);