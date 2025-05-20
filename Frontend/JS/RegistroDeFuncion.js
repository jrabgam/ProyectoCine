document.addEventListener("DOMContentLoaded", async () => {
    const salaSelect = document.getElementById("sala"); 
    const peliculaSelect = document.getElementById("pelicula"); 
    const form = document.getElementById("asignarFuncionForm");

    try {
        const resSalas = await fetch("http://localhost:3000/api/salas");
        const salas = await resSalas.json();
        salas.forEach(sala => {
            const Salaid = document.createElement("option");
            Salaid.value = sala.id || sala.sala_id; 
            Salaid.textContent = sala.nombre;
            salaSelect.appendChild(Salaid);
        });
    } catch (err) {
        console.error("Error:", err);
    }
    try {
        const resPeliculas = await fetch("http://localhost:3000/api/peliculas");
        const peliculas = await resPeliculas.json();
        peliculas.forEach(peli => {
            const pelicid = document.createElement("option");
            pelicid.value = peli.id || peli.pelicula_id; 
            pelicid.textContent = peli.titulo;
            peliculaSelect.appendChild(pelicid);
        });
    } catch (err) {
        console.error("Error:", err);
    }


    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const sala_id = salaSelect.value;
        const pelicula_id = peliculaSelect.value;
        const fecha = document.getElementById("fechaFuncion").value;
        if (!sala_id || !pelicula_id || !fecha) {
            alert("Por favor complete los dastos solicitados.");
            return;
        }
        try {
            const res = await fetch("http://localhost:3000/api/funciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({sala_id, pelicula_id, fecha})
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.mensaje || "Funcion Guardada.");
                form.reset();
            } else {
                alert(data.mensaje || "Error al guardar la función.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error al guardar la función.");
        }
    });
});
