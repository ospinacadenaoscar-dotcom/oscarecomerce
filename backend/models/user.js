import mongoose from "mongoose";
const usersSchema = new mongoose.Schema({
    Nombre:{type:String,required:true},
    Apellido:{type:String,required:true},
    Edad:{type:Number,required:true},
    Gmail:{type:String,required:true},
    Telefono:{type:Number,required:true},
    Paswords:{type:String,required:true}
});


//forzamos para que me guarde la informacion en la coleccion productos
const users=mongoose.model("users",usersSchema,"users");

export default users;

