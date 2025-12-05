import bcrypt from 'bcrypt';
import users from '../models/user.js';

export const loginUser = async (req, res)=>{
    try {
        const {Gmail, Paswords} = req.body;

        // validamos que los campos esten presentes
        if(!Gmail || !Paswords){
            return res.status(400).json({message: "correo y contraseña son obligatorios"});
        }

        //buscamos el usuario en la base d edatos 

        const usuario = await users.findOne({Gmail});
        if(!usuario){
            return res.status(404).json({message: "Usuario no encontrado"});
        }

        // comparamos la contraseña encriptada en la base de datos 

        const PaswordsValido = await bcrypt.compare(Paswords, usuario.Paswords);
        if(!PaswordsValido){
            return res.status(401).json({message: "Contraseña incorrecta"});
        }
        res.status(200).json({
            message:"inicio de secion correcto",
            usuario:{
                id: usuario._id,
                Nombre: usuario.Nombre,
                Apellido: usuario.Apellido,
                Gmail: usuario.Gmail,
                Telefono: usuario.Telefono
            }
        });
    }catch (error) {
        res.status(500).json({message: "Error al iniciar secion", error: error.message})
    }
}