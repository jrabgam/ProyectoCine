document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("RegistroBTN").addEventListener("click", async function () {
        let nombre = document.getElementById("nombre").value.trim();
        let usuario = document.getElementById("usuario").value.trim();
        let correo = document.getElementById("correo").value.trim();
        let rol = document.getElementById("rol").value.trim();
        let password = document.getElementById("contrasenia").value.trim();

        console.log("Nombre:", nombre);
        console.log("Usuario:", usuario);
        console.log("Correo:", correo);
        console.log("Rol:", rol);
        console.log("Password:", password);
        /*Limpiarmos
        nombre.value = "";
        usuario.value = "";
        correo.value = "";
        rol.value = ""; 
        password.value = "";*/
        // Validaciones
        if (!nombre || !usuario || !correo || !password) {
            alert("Ingrese todos los campos, por favor");
            return;
        }
        if (password.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres para mayor seguridad.");
            return;
        }
        let datos = { nombre, usuario, correo, rol, password };
        try {
            let respuesta = await fetch("http://localhost:3000/api/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });
            let resultado = await respuesta.json();
            if (respuesta.ok) {
                alert("¡Usuario registrado!");
                limpiarFormulario();
                window.location.href = "LogIn.html";
            } else {
                alert(resultado.mensaje);
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("No se pudo conectar con el servidor. Intente más tarde.");
        }
    });
});

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("contrasenia").value = "";
}