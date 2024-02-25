
function capturar_id() {
    var selectElement = document.getElementById("mySelect");
     var selectedOption = selectElement.options[selectElement.selectedIndex];
    var id = selectedOption.id;
    var inputElement = document.getElementById("id_select");
    inputElement.value = id;
  }
