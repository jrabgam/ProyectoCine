document.getElementById("GuardarPeliculabtn").addEventListener("click", async function (e) {
    e.preventDefault();
    const titulo = document.getElementById("NPelicula").value.trim();
    const duracion = document.getElementById("Duracion").value.trim();
    const anio = document.getElementById("AnioPublicacion").value.trim();
    const clasificacion = document.getElementById("Clasificacion").value.trim();
    const imagen = document.getElementById("Imagen").files[0]; 

    if (!titulo || !duracion || !anio || !clasificacion) {
        alert("Por favor ingrese todos los datos solicitados");
        return;
    }
    const formData = new FormData();
    formData.append("duracion", duracion);
    formData.append("anioPublicacion", anio);
    formData.append("clasificacion", clasificacion);
    if (imagen) {
        formData.append("poster", imagen);
    }
    try {
        const respuesta = await fetch(`http://localhost:3000/api/peliculas/nombre/${encodeURIComponent(titulo)}`, {
            method: "PUT",
            body: formData
        });
        const resultado = await respuesta.json();
        alert(resultado.mensaje);
    } catch (error) {
        console.error("Error al actualizar la película:", error);
        alert("Ocurrió un error al actualizar la película");
    }
});
