import express from 'express';
import cors from 'cors';
import "./db/db.js"
import productosRoutes from './routes/productos.js'


const app = express();


// habilitar todas las rutas 

app.use(cors());

// primera ruta
app.get('/', (req, res)=>{
    res.send('bienvenido al curso de node express');
});

app.use("/api/productos",productosRoutes);

app.listen(8081,()=> console.log('servidor corriendo en http://localhost:8081'));