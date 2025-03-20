//app.use(express.static("Frontend/JS"));
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("IniciarSesionBTN").addEventListener("click", function() {
        let usuario = document.getElementById("usuario").value;
        let password = document.getElementById("contrasenia").value;

        //SOLICITUD FETCH
        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('R:', data);
            
            if (data.token) {
                // Si el login es exitoso, guardamos el token y mostramos el menú
                alert('¡Dentro del sistema!');
                localStorage.setItem('Token:', data.token); 
                localStorage.setItem('Rol', data.rol);  

                // Se le asigna el menu segun el rol
                if (data.rol === "admin") {
                    window.location.href = "../Interfaz/MenuAdministrador.html";
                } else {
                    window.location.href = "../Interfaz/MenuCliente.html";
                }
            } else {
                alert('Error, pruebe otra vez');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });

        // Limpiar los campos
        document.getElementById("usuario").value = "";
        document.getElementById("contrasenia").value = "";
    });
});
