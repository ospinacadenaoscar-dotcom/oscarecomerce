import productos from "../models/productos.js";

// creear el producto
export const crearProducto= async(req, res)=>{
     try{
        const{productId,Nombre,Descripcion,Precio,imagen}=req.body;
        const newProduct=new productos({
            productId,
            Nombre,
            Descripcion,
            Precio,
            imagen
        });
        await newProduct.save();
        res.status(201).json({messaje:"producto guardado con exito"});

    }catch(error){
        console.error("error al guardar el producto",error);
        res.status(400).json({messaje:"error al ingresar el producto"
        });

    }
};

// traer los datos de la base de datos 
export const obtenerProductos= async(req, res)=>{
    try{
        const listarproductos =await productos.find();
    res.status(200).json(listarproductos);
    }catch(error){
        res.status(500).json({messaje:"error al obtener los productos"});
    }
};
