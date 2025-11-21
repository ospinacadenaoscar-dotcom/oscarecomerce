import mongoose from "mongoose";
import mongose from "mongoose"
const productosSchema = new mongose.Schema({
    producId:{type:String,required:true,unique:true},
    Nombre:{type:String,required:true},
    Descripcion:{type:String,required:true},
    Precio:{type:Number,required:true},
    image:{type:String,required:true},
});
//forzamos para que me guarde la informacion en la coleccion productos
const product=mongoose.model("productos",productosSchema,"productos");

export default product;