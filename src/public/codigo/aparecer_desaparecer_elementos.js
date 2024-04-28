const aparecer_desaparecer = (id)=>{
	 let elementos = document.querySelectorAll(`[id="${id}"]`);

    // Recorrer todos los elementos
    elementos.forEach(elemento => {
        // Toggle de la clase
        elemento.classList.toggle("none");
    });
}



