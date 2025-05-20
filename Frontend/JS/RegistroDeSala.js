document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("GuardarSalabtn").addEventListener("click", async function () {
        let nombre = document.getElementById("nombreDeSala").value.trim();
        let pelicula = document.getElementById("pelicula").value.trim();
        let filas = document.getElementById("filas").value.trim();
        let columnas = document.getElementById("columnas").value.trim();
        let poster = document.getElementById("poster").files[0]; 

        console.log("Nombre de sala:", nombre);
        console.log("Película:", pelicula);
        console.log("Filas:", filas);
        console.log("Columnas:", columnas);
        console.log("Imagen:", poster);

        if (!nombre || !pelicula || !filas || !columnas || !poster) {
            alert("Por favor ingrese todos los datos solicitados");
            return;
        }
        let formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("pelicula", pelicula);
        formData.append("filas", filas);
        formData.append("columnas", columnas);
        formData.append("poster", poster); 

        try {
            let respuesta = await fetch("http://localhost:3000/api/salas", {
                method: "POST",
                body: formData 
            });
            let resultado = await respuesta.json();
            if (respuesta.ok) {
                alert("Sala registrada con éxito.");
                limpiarFormulario();
               // window.location.href = "../Interfaz/MenuAdministrador.html";
            } else {
                alert(resultado.mensaje);
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Sala registrada con Exito.");
        }
    });
});

function limpiarFormulario() {
    document.getElementById("nombreDeSala").value = "";
    document.getElementById("pelicula").value = "";
    document.getElementById("filas").value = "";
    document.getElementById("columnas").value = "";
    document.getElementById("poster").value = "";
}
