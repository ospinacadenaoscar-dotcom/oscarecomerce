import users from "../models/user.js";
import bcrypt from "bcrypt";

// creacion de los usuarios 

export const registrarUsers= async(req, res)=>{
    try{
        const{Nombre,Apellido,Edad,Gmail,Telefono,Paswords}=req.body;

        //validar que no falte ningun campo

        if(!Nombre||!Apellido||!Edad||!Gmail||!Telefono||!Paswords){
            return res.status(400).json({message:"Todos los campos son obligatorios"});
    }

    //validar si el usuario ya existe
    const existeUsuario=await users.findOne({Gmail})
    if(existeUsuario){
        return res.status(400).json({message:"El usuario ya esta registrado"});
    }

    // encriptar la contraseña 
    const saltRounds=10;
    const hashedpassword=await bcrypt.hash(Paswords,saltRounds);
    // crear el usuario en la base de datos
    const nuevoUsuario=new users({Nombre,Apellido,Edad,Gmail,Telefono,Paswords:hashedpassword});
    await nuevoUsuario.save();
    res.status(201).json({message:"Usuario registrado con exito"});
        

    }catch(error){
        res.status(500).json({message:"Error al registrar el usuario",error:error.message});

    }
}
