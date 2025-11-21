import express from 'express';
import productos from "../models/productos.js";
const router=express.Router();

router.post("/",async function(req,res){
    try{
        const{productId,Nombre,Descripcion,Precio,imagen}=req.body;
        const newProduct=new productos({
            productId,
            Nombre,
            Descripcion,
            Precio,
            image
        });
        await newProduct.save();
        res.status(201).json({messaje:"producto guardado con exito"});

    }catch(error){
        console.error("error al guardar el producto",error);
        res.status(400).json({messaje:"error al ingresar el producto"
        });

    }
})
export default router;