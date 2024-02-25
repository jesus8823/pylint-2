const menu = document.querySelector('.menu');

function mostrar_menu() {
	menu.style.transform = `translateX(0)`;
	menu.style.opacity = "1";
};

function cerrar_menu() {
	menu.style.transform = `translateX(-100%)`;
	menu.style.opacity = "0";
};