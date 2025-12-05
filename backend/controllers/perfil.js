// importamos el modelo de la base de datos 
import Users from "../models/user.js";

// obtener perfil del usuario de la base de datos 
export const obterPerfil = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({message: "Email es requerido"});
        }

        // traer el correo del usuario 
        const user = await Users.findOne({Gmail: email}).select('-paswords');
        if (!user){
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        res.status(200).json({
            user: {
                id: user._id,
                Nombre: user.Nombre,
                Apellido: user.Apellido,
                Gmail: user.Gmail,
                Telefono: user.Telefono
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el perfil", 
            error: error.message
        })
    }
}

// actualizar perfil del usuario
export const actualizarPerfil = async (req, res) => {
    try {
        const {Gmail, Nombre, Apellido, Telefono } = req.body;

        // validar campos obligatorios
        if (!Gmail) {
            return res.status(400).json({message: "Gmail es requerido"});
        }

        if (!Nombre || !Apellido || !Telefono) {
            return res.status(400).json({message: "Todos los campos son obligatorios" });
        }

        // buscar y actualizar usuario
        const usuarioActualizado = await Users.findOneAndUpdate(
            {Gmail: Gmail},
            {
                Nombre: Nombre,
                Apellido: Apellido,
                Telefono: Telefono
            },
            { new: true }
        ).select('-paswords');

        if (!usuarioActualizado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        res.status(200).json({
            message: "Perfil actualizado exitosamente",
            usuario: {
                id: usuarioActualizado._id,
                Nombre: usuarioActualizado.Nombre,
                Apellido: usuarioActualizado.Apellido,
                Gmail: usuarioActualizado.Gmail,
                Telefono: usuarioActualizado.Telefono
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar perfil",
            error: error.message
        });
    }
};

export const eliminarPerfil = async (req, res) => {
    try {
        const { email } = req.body;

        // Validar que el email este presente
        if (!email) {
            return res.status(400).json({ message: "Email es requerido"});
        }

        // Buscar y eliminar usuario 
        const usuarioEliminado = await Users.findOneAndDelete({
            Gmail: email
        });

        if (!usuarioEliminado) {
            return res.status(404).json({ message: " Usuario no encontrado"});
        }

        res.status(200).json({
            message: "Usuario eliminado exitosamente",
            usuario: {
                id: usuarioEliminado._id,
                Nombre: usuarioEliminado.Nombre,
                Apellido: usuarioEliminado.Apellido,
                Gmail: usuarioEliminado.Gmail
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar perfil",
            Error: error.message
        });
    }
};