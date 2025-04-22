//require('dotenv').config(); // Cargar las variables de entorno del archivo .env
require('dotenv').config({ path: '../.env' }); // se cambio la ruta del .env
const mysql = require('mysql2');
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
app.use('/uploads', express.static('uploads'));
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


// POST para registrar usuario
app.post('/api/registro', (req, res) => {
    const {nombre, usuario, correo, rol, password} = req.body;

    // Verificamos si el usuario ya existe
    connection.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
        if (err) {
            console.error('Error en la consulta de BD', err);
            return res.status(500).json({ mensaje: 'Error en el servidor.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ mensaje: 'Usuario existente, intente con otro usuario.' });
        }

        // Para que la contraseña no este en texto plaano
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error de codificación:', err);
                return res.status(500).json({ mensaje: 'Hubo un problema al registrar el usuario.' });
            }

            // Si el usuario no existe, insertamos el nuevo registro
            //INSERT INTO `usuarios`(`nombre`, `usuario`, `correo`, `contraseña`, `rol`) VALUES ('Jenifer','jrabgam_','jeniferrabanales99@gmail.com','ConejoFeliz124','Cajera')
            const query = 'INSERT INTO usuarios (nombre, usuario, correo, contraseña, rol) VALUES (?, ?, ?, ?, ?)';
            connection.query(query, [nombre, usuario, correo, hashedPassword, rol], (err, results) => {
                if (err) {
                    console.error('No se pudo registrar el usuario por:', err);
                    return res.status(500).json({ mensaje: 'Hubo un problema al registrar el usuario.' });
                }

                res.status(200).json({ mensaje: '¡Usuario registrado!' });
            });
        });
    });
});


//POST PARA INICIO DE SESION
//ruta: http://localhost:3000/api/login
/*{
    "usuario": "pruebaUsuario",
    "password": "pruebaContraseña"
}*/

// POST para iniciar sesión
app.post('/api/login', (req, res) => {
    const {usuario, password} = req.body;

    connection.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(400).json({ mensaje: 'No se encontró este usuario en la BD' });
        }

        const user = results[0];

        bcrypt.compare(password, user.contraseña, (err, isMatch) => {
            if (err) {
                console.error('Error al comparar las contraseñas:', err);
                return res.status(500).json({ mensaje: 'Error al verificar la contraseña.' });
            }

            if (!isMatch) {
                return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
            }

            const token = jwt.sign({ id: user.id, usuario: user.usuario, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ mensaje: 'Login exitoso', token, rol: user.rol });
        });
    });
});
//RUTA PARA AGREGAR SALA
/*POST: http://localhost:3000/api/salas
Body -> form-data
nombre	text	Sala No.13
filas	text	25
columnas  text	30
pelicula  text	El cadaver de la novia
poster	File	img.jpg*/

//PARA IMAGEN
const uploadsDir = 'public/uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Para la asignacion de nombre de la imagen
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Solo se permiten archivos tipo imagen'), false);
        }
        cb(null, true);
    }
});

//POST PARA AGREGAR SALA
app.post('/api/salas', upload.single('poster'), (req, res) => {
    const {nombre, pelicula, filas, columnas} = req.body;
    const imagen = req.file ? req.file.filename : null;

    if (!nombre || !pelicula || !filas || !columnas || !imagen) {
        return res.status(400).json({ mensaje: 'Ingrese todos los campos solicitados, por favor'});
    }

    //INSERT INTO `salas`(`nombre`, `filas`, `columnas`, `pelicula`, `imagen`) VALUES ('Salan No.1',35,34,'La Bella y la Bestia','imagen.png');
    const query = 'INSERT INTO salas (nombre, pelicula, filas, columnas, imagen) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [nombre, pelicula, filas, columnas, imagen], (err, results) => {
        if (err) {
            console.error('Error al insertar la sala:', err);
            return res.status(500).json({ mensaje: 'Hubo un problema al registrar la sala' });
        }

        res.status(200).json({ mensaje: 'Sala registrada exitosamente' });
    });
});


// Ruta para agregar película
//POST http://localhost:3000/api/peliculas
/*titulo	Text	El señor de los anillos
poster	File	img.jpg
duracion	Text	180 min
anioPublicacion Text	2001
clasificacion	Text	Ficcion*/
  
    app.post("/api/peliculas", upload.single("poster"), (req, res) => {
        const { titulo, duracion, anioPublicacion, clasificacion } = req.body;
        const imagen_url = req.file ? req.file.filename : null;
        if (!titulo || !duracion || !anioPublicacion || !clasificacion || !imagen_url) {
            return res.status(400).json({ 
                mensaje: "Ingrese todos los campos solicitados, por favor.", 
            });
        }
        //INSERT INTO `peliculas`(`titulo`, `imagen_url`, `duracion`, `anioPublicacion`, `clasificacion`) VALUES ('La bella y la bestia','img2.jpg','2 horas','2000','Romance')
        const query = `INSERT INTO peliculas (titulo, imagen_url, duracion, anioPublicacion, clasificacion) VALUES (?, ?, ?, ?, ?)`;
        connection.query(query, [titulo, imagen_url, duracion, anioPublicacion, clasificacion], (err, result) => {
            if (err) {
                console.error("Error al insertar película", err);
                return res.status(500).json({ mensaje: "Error del servidor al guardar la película.", success: false });
            }
            res.status(200).json({ mensaje: "Película registrada exitosamente.", success: true });
        });
    });
    

//PUT
//RUTA: http://localhost:3000/api/peliculas/1
/*{
    "titulo": "Nueva Película",
    "imagen_url": "https://example.com/nueva-imagen.jpg",
    "duracion": "120 min",
    "anioPublicacion": 2024,
    "clasificacion": "PG-13"
}*/
app.put("/api/peliculas/nombre/:titulo", upload.single("poster"), (req, res) => {
    const { titulo } = req.params;
    const { duracion, anioPublicacion, clasificacion } = req.body;
    const nuevaImagen = req.file ? req.file.filename : null;

    if (!duracion || !anioPublicacion || !clasificacion) {
        return res.status(400).json({ mensaje: "Ingrese todos los campos solicitados, por favor", success: false });
    }
    const selectQuery = "SELECT imagen_url FROM peliculas WHERE titulo = ?";
    connection.query(selectQuery, [titulo], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ mensaje: "La pelicula no fue encontrada", success: false });
        }
        const imagenActual = results[0].imagen_url;
        const imagenFinal = nuevaImagen || imagenActual;
        const updateQuery = `
            UPDATE peliculas SET duracion = ?, anioPublicacion = ?, clasificacion = ?, imagen_url = ? WHERE titulo = ?`;
        connection.query(updateQuery, [duracion, anioPublicacion, clasificacion, imagenFinal, titulo], (err2, result) => {
            if (err2) {
                console.error("Error al actualizar la película:", err2);
                return res.status(500).json({ mensaje: "Error al actualizar la película", success: false });
            }

            res.status(200).json({ mensaje: "Película actualizada exitosamente", success: true });
        });
    });
});
//EXTRAER POR NOMBRE
app.get("/api/peliculas/:titulo", (req, res) => {
    const { titulo } = req.params;
    const query = "SELECT * FROM peliculas WHERE titulo = ?";
    
    connection.query(query, [titulo], (err, result) => {
        if (err) {
            console.error("Error al buscar la película:", err);
            return res.status(500).json({ mensaje: "Error al buscar la película" });
        }

        if (result.length === 0) {
            return res.status(404).json({ mensaje: "Película no encontrada" });
        }

        res.status(200).json(result[0]);
    });
});

// Obtener salas
//http://localhost:3000/api/salas
app.get("/api/salas", (req, res) => {
    connection.query("SELECT id, nombre FROM salas", (err, results) => {
        if (err) {
            console.error("Error", err);
            return res.status(500).json({ mensaje: "Error al obtener salas" });
        }
        res.json(results);
    });
});

// Obtener películas
//http://localhost:3000/api/peliculas
app.get("/api/peliculas", (req, res) => {
    connection.query("SELECT id, titulo FROM peliculas", (err, results) => {
        if (err) {
            console.error("Error", err);
            return res.status(500).json({ mensaje: "Error al obtener películas" });
        }
        res.json(results);
    });
});

//Guardar Funcion
//POST http://localhost:3000/api/funciones
app.post("/api/funciones", (req, res) => {
    const { sala_id, pelicula_id, fecha } = req.body;

    // Validar que los campos estén presentes
    if (!sala_id || !pelicula_id || !fecha) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const query = "INSERT INTO funciones (sala_id, pelicula_id, fecha) VALUES (?, ?, ?)";
    connection.query(query, [sala_id, pelicula_id, fecha], (err, result) => {
        if (err) {
            console.error("Error al guardar la función:", err);
            return res.status(500).json({ mensaje: "Error al guardar la función" });
        }
        res.status(200).json({ mensaje: "Función guardada exitosamente" });
    });
});



// Configurar el servidor 
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});