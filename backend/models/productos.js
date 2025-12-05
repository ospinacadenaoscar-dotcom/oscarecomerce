import mongoose from "mongoose";
const productosSchema = new mongoose.Schema({
    productId:{type:String,required:true,unique:true},
    Nombre:{type:String,required:true},
    Descripcion:{type:String,required:true},
    Precio:{type:Number,required:true},
    imagen:{type:String,required:true},
});
//forzamos para que me guarde la informacion en la coleccion productos
const product=mongoose.model("productos",productosSchema,"productos");

export default product;