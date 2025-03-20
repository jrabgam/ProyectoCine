//require('dotenv').config(); // Cargar las variables de entorno del archivo .env
require('dotenv').config({ path: '../.env' }); // se cambio la ruta del .env
const mysql = require('mysql2');
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET;
app.use(express.json());
app.use(cors());
app.use(express.static("Frontend/Interfaz"));
app.use(express.static("Frontend/JS"));

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//conexion de la bd
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión en la BD:', err);
        return;
    }
    console.log('Conexión exitosa');
});

//POST PARA REGISTRA USUARIO
//http://localhost:3000/api/registro
/*{
    "nombre": "Apolonio Rabanales",
    "usuario": "apo123",
    "correo": "apon@example.com",
    "rol": "admin",
    "password": "patito123"
  }*/

app.post('/api/registro', (req, res) => {
    const { nombre, usuario, correo, rol, password } = req.body;
    //SELECT * FROM `usuarios` WHERE usuario="prueba"
    //Verificamos si ya fue ingresado
    connection.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
        if (err) {
            console.error('Error en la consulta de BD', err);
            return res.status(500).json({ mensaje: 'Error en el servidor.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ mensaje: 'Usuario Existente, intente con otro usuario.' });
        }

        // Si el usuario no existe, insertamos el nuevo registro
        //INSERT INTO `usuarios`(`nombre`, `usuario`, `correo`, `contraseña`, `rol`) VALUES ('Jenifer','jrabgam_','jeniferrabanales99@gmail.com','ConejoFeliz124','Cajera')
        const query = 'INSERT INTO usuarios (nombre, usuario, correo, contraseña, rol) VALUES (?, ?, ?, ?, ?)';
        connection.query(query, [nombre, usuario, correo, password, rol], (err, results) => {
            if (err) {
                console.error('Error al insertar el usuario:', err);
                return res.status(500).json({ mensaje: 'No se registro el usuario, intentar nuevamente.' });
            }

            res.status(200).json({ mensaje: '¡Usuario registrado con exito!' });
        });
    });
});

//POST PARA INICIO DE SESION
//ruta: http://localhost:3000/api/login
/*{
    "usuario": "pruebaUsuario",
    "password": "pruebaContraseña"
}*/

app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;

    //SELECT * FROM `usuarios` WHERE usuario="prueba"
    connection.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }

        if (results.length === 0) {
            //console.log("Usuario no encontrado");
            return res.status(400).json({ mensaje: 'Usuario no registrado' });
        }

        const user = results[0];

        // TEMPORAL; ARREGLAR CONTRASEÑA
        if (user.contraseña !== password) {
            console.log("Contraseña incorrecta");
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        // console.log("Contraseña correcta");
    
        // Generar token con el ID, usuario y rol
        const token = jwt.sign({ id: user.id, usuario: user.usuario, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            mensaje: 'Bienvenido', 
            token, 
            rol: user.rol // Enviamos el rol al frontend
        });
    });
    
    });

    // Configura el puerto en el que escuchará el servidor
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });