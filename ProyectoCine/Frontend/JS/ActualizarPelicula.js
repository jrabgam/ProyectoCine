document.addEventListener("DOMContentLoaded", function () {
    const buscarBtn = document.getElementById("BuscarPeliculabtn");
    const guardarBtn = document.getElementById("GuardarPeliculabtn");
    buscarBtn.addEventListener("click", async function (e) {
        e.preventDefault();
        const titulo = document.getElementById("NPelicula").value.trim();

        if (!titulo) {
            alert("¿Que pelicula desea buscar?");
            return;
        }
        try {
            const respuesta = await fetch(`http://localhost:3000/api/peliculas/${titulo}`);
            if (!respuesta.ok) {
                const res = await respuesta.json();
                alert(res.mensaje || "No hay información sobre su busqueda");
                return;
            }
            const pelicula = await respuesta.json();
            document.getElementById("Duracion").value = pelicula.duracion;
            document.getElementById("AnioPublicacion").value = pelicula.anioPublicacion;
            document.getElementById("Clasificacion").value = pelicula.clasificacion;
        } catch (error) {
            console.error("Error al buscar película:", error);
            alert("Hubo un error al buscar la película");
        }
    });
});
