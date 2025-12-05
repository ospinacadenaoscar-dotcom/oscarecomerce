import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
// Importa tu modelo 'users'. Asegúrate de que la ruta sea correcta.
import users from "../models/user.js"; 

// --- CONFIGURACIÓN CON TUS CREDENCIALES ---
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ospinacadenaoscar@gmail.com', // <--- Tu correo
        pass: 'gamcrahnfrjlugif'             // <--- Tu contraseña de aplicación
    }
});

// Función de generar código de 6 dígitos
const generarCodigo = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// 1. SOLICITAR CÓDIGO (POST /api/recuperar/solicitar-codigo)
export const solicitarCodigo = async (req, res) => {
    try {
        const { Gmail } = req.body; 

        if (!Gmail) {
            return res.status(400).json({ message: "El Gmail es obligatorio" });
        }

        const usuario = await users.findOne({ Gmail });

        if (!usuario) {
            // No revelamos si el correo existe por seguridad, devolvemos un mensaje genérico.
            return res.status(200).json({ message: "Si el correo existe, recibirás un código." });
        }

        const codigo = generarCodigo();
        const expiracion = Date.now() + 900000; // 15 minutos

        // 🔥 TRUCO: Forzamos la escritura de campos no definidos en el modelo (codigoRecuperacion, codigoExpiracion)
        await users.updateOne(
            { _id: usuario._id },
            { 
                $set: { 
                    codigoRecuperacion: codigo, 
                    codigoExpiracion: expiracion 
                } 
            },
            { strict: false } // Permite guardar campos no definidos en el Schema
        );

        // Enviar email
        const mailOptions = {
            from: 'ospinacadenaoscar@gmail.com',
            to: Gmail,
            subject: 'Código de recuperación - Tienda AXT',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h2 style="color: #4F46E5;">Recuperación de Contraseña</h2>
                <p>Tu código de verificación es:</p>
                <div style="background: #f3f4f6; padding: 15px; display: inline-block; border-radius: 8px;">
                    <h1 style="letter-spacing: 5px; margin: 0; color: #333;">${codigo}</h1>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">Expira en 15 minutos.</p>
            </div>
            `
        };

        await transport.sendMail(mailOptions);
        console.log(`Código enviado a ${Gmail}: ${codigo}`);

        res.status(200).json({ message: "Código enviado. Revisa tu correo." });

    } catch (error) {
        console.error("Error al enviar código:", error);
        res.status(500).json({ message: "Error al enviar código", error: error.message });
    }
};

// 2. CAMBIAR PASSWORD (POST /api/recuperar/cambiar-password)
export const cambiarPassword = async (req, res) => {
    try {
        const { Gmail, codigo, nuevaPassword } = req.body;

        if (!Gmail || !codigo || !nuevaPassword) {
            return res.status(400).json({ message: "Faltan datos (Gmail, codigo, nuevaPassword) son obligatorios." });
        }
        
        if (nuevaPassword.length < 6) {
             return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }

        // Buscamos al usuario básico
        const usuario = await users.findOne({ Gmail });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // 🔥 LECTURA DEL TRUCO: Buscamos el documento REAL en la colección para obtener los campos ocultos
        const usuarioDataReal = await users.collection.findOne({ 
            _id: usuario._id 
        });

        if (!usuarioDataReal || !usuarioDataReal.codigoRecuperacion || usuarioDataReal.codigoRecuperacion !== codigo) {
            return res.status(400).json({ message: "Código de verificación inválido" });
        }

        if (Date.now() > usuarioDataReal.codigoExpiracion) {
            return res.status(400).json({ message: "El código ha expirado" });
        }

        // Encriptar password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

        // Actualizamos la contraseña y borramos el código temporal
        await users.updateOne(
            { _id: usuario._id },
            { 
                $set: { Paswords: hashedPassword }, // <--- Tu campo Paswords se actualiza aquí
                $unset: { codigoRecuperacion: 1, codigoExpiracion: 1 } // Eliminamos los campos temporales
            }
        );

        // Email confirmación
        await transport.sendMail({
            from: 'ospinacadenaoscar@gmail.com',
            to: Gmail,
            subject: 'Contraseña cambiada exitosamente',
            html: `<p>Tu contraseña ha sido actualizada correctamente.</p>`
        });

        res.status(200).json({ message: "Contraseña cambiada exitosamente" });

    } catch (error) {
        console.error("Error al cambiar password:", error);
        res.status(500).json({ message: "Error al cambiar password", error: error.message });
    }
};