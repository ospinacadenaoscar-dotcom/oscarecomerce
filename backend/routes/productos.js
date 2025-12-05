import express from 'express';
import {crearProducto,obtenerProductos} from "../controllers/productos.js";
const router= express.Router();

// ruta para crear producto
router.post("/", crearProducto);

//ruta para obtener todos los productos
router.get("/", obtenerProductos);

export default router;