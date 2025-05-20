document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registroPeliculaForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log(document.getElementById("NPelicula"));
        let titulo = document.getElementById("NPelicula").value.trim();
        let duracion = document.getElementById("Duracion").value.trim();
        let poster = document.getElementById("Imagen").files[0];
        let anioPublicacion = document.getElementById("AnioPublicacion").value.trim();
        let clasificacion = document.getElementById("Clasificacion").value.trim();
        console.log("Título:", titulo);
        console.log("Duración:", duracion);
        console.log("Imagen:", poster);
        console.log("Año de publicación:", anioPublicacion);
        console.log("Clasificación:", clasificacion);

        if (!titulo || !duracion || !poster || !anioPublicacion || !clasificacion) {
            alert("Por favor ingrese todos los datos solicitados");
            return;
        }

        let formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("duracion", duracion);
        formData.append("poster", poster);
        formData.append("anioPublicacion", anioPublicacion);
        formData.append("clasificacion", clasificacion);

        try {
            let respuesta = await fetch("http://localhost:3000/api/peliculas", {
                method: "POST",
                body: formData
            });

            let resultado = await respuesta.json();
            if (respuesta.ok) {
                alert("Película registrada con éxito.");
                limpiarFormularioPelicula();
                // window.location.href = "../Interfaz/MenuAdministrador.html";
            } else {
                alert(resultado.mensaje || "Ocurrió un error");
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Error al registrar la película.");
        }
    });
});

function limpiarFormularioPelicula() {
    document.getElementById("NPelicula").value = "";
    document.getElementById("Duracion").value = "";
    document.getElementById("Imagen").value = "";
    document.getElementById("AnioPublicacion").value = "";
    document.getElementById("Clasificacion").value = "";
}
