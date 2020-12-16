
const funcionInit = () => {
	if (!"geolocation" in navigator) {
		return alert("Tu navegador no soporta el acceso a la ubicación. Intenta con otro");
	}

	const $latitud = document.querySelector("#latitud"),
		$longitud = document.querySelector("#longitud"),
		$enlace = document.querySelector("#enlace");


	const onUbicacionConcedida = ubicacion => {
		
		const coordenadas = ubicacion.coords;
		var coordenada = localStorage.getItem("latitud");
		if (coordenada === null) {
			localStorage.setItem("latitud",coordenadas.latitude);
			localStorage.setItem("longitud",coordenadas.longitude);
		
		}else{


		}
			$latitud.innerText = coordenadas.latitude;
			$longitud.innerText = coordenadas.longitude;
	
		
	}
	const onErrorDeUbicacion = err => {

		$latitud.innerText = "Error obteniendo ubicación: " + err.message;
		$longitud.innerText = "Error obteniendo ubicación: " + err.message;
		console.log("Error obteniendo ubicación: ", err);
	}

	const opcionesDeSolicitud = {
		enableHighAccuracy: true, // Alta precisión
		maximumAge: 0, // No queremos caché
		timeout: 5000 // Esperar solo 5 segundos
	};

	$latitud.innerText = "Cargando...";
	$longitud.innerText = "Cargando...";
	navigator.geolocation.getCurrentPosition(onUbicacionConcedida, onErrorDeUbicacion, opcionesDeSolicitud);

};
//document.addEventListener("DOMContentLoaded", funcionInit);
$("#guardarUbicacion").click(function(){
			funcionInit();
});
function pagoOnChange(sel) {
      if (sel.value=="CREDITO"){
           seleccion = document.getElementById("pagoCredito");
           seleccion.style.display = "";

      }else{

           seleccion = document.getElementById("pagoCredito");
           seleccion.style.display = "none";

      }
}
function proveedorChange(sel){

		if (sel.value == "otro") {

			seleccion = document.getElementById("proveedor");
			seleccion.value = ""
			seleccion.style.display = "";

		}else{

			seleccion = document.getElementById("proveedor");
			seleccion.style.display = "none";


		}


}
function proveedorChange2(sel){

	if (sel.value == "otro") {

		seleccion = document.getElementById("proveedor2");
		seleccion.value = ""
		seleccion.style.display = "";

	}else{

		seleccion = document.getElementById("proveedor2");
		seleccion.style.display = "none";


	}


}
