//app.use(express.static("Frontend/JS"));
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("IniciarSesionBTN").addEventListener("click", function() {
        let usuario = document.getElementById("usuario").value;
        let password = document.getElementById("contrasenia").value;

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
            console.log('Respuesta del servidor:', data);
            
            if (data.token) {
                alert('BIENVENIDO, AL SISTEMA DEL CINE¡');
                localStorage.setItem('Token', data.token); 
                localStorage.setItem('Rol', data.rol);  

                if (data.rol === "admin") { 
                    window.location.href = "../Interfaz/MenuAdministrador.html";
                    console.log('MENU PARA ADMINISTRADOR');
                } else if (data.rol === "cliente") {
                    window.location.href = "../Interfaz/MenuCliente.html";
                    console.log('MENU PARA CLIENTE');
                } else {
                    alert("SOLAMENTE SE ACEPTA 2 TIPO DE ROL, cliente o admin");
                }
            } else {
                alert('Error en el Registro. Inténtalo de nuevo, por favor.');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
        document.getElementById("usuario").value = "";
        document.getElementById("contrasenia").value = "";
    });
});
