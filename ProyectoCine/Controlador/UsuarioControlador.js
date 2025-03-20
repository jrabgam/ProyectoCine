const db = require("../config/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.recuperarContrasena = (req, res) => {
    const { correo } = req.body;

    db.query("SELECT * FROM usuarios WHERE correo = ?", [correo], (error, results) => {
        if (error || results.length === 0) {
            return res.status(404).json({ mensaje: "Correo no encontrado" });
        }

        // Generar un token válido por 15 minutos
        const token = jwt.sign({ correo }, "secreto", { expiresIn: "15m" });

        // Enlace de recuperación (cambia localhost por tu dominio si está en producción)
        const enlace = `http://localhost:5500/nuevaContrasena.html?token=${token}`;

        // Configurar el servicio de correo
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tuemail@gmail.com",
                pass: "tupassword"
            }
        });

        // Enviar correo con el enlace de recuperación
        const mailOptions = {
            from: "tuemail@gmail.com",
            to: correo,
            subject: "Recuperación de Contraseña",
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                   <a href="${enlace}">Restablecer Contraseña</a>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.status(500).json({ mensaje: "Error al enviar el correo" });

            res.json({ mensaje: "Correo enviado con éxito" });
        });
    });
};
