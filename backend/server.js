import express from 'express';
import cors from 'cors';
import "./DB/db.js";
import productosRoutes from './routes/productos.js'
import usersRoutes from './routes/user.js';
import loginRoutes from './routes/login.js';
import obterPerfil from './routes/perfil.js';
import cambiarPassword from './routes/recuperar.js';


const app = express();
app.use(express.json());


// habilitar todas las rutas 

app.use(cors());

// primera ruta
app.get('/', (req, res)=>{
    res.send('bienvenido al curso de node express');
});


// Api de productos
app.use("/api/productos",productosRoutes);
app.use("/api/users",usersRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/perfil", obterPerfil);
app.use('/api/recuperar',cambiarPassword);


app.listen(8081,()=> console.log('servidor corriendo en http://localhost:8081'));