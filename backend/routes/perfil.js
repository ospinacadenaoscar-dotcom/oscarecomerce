import express from 'express';
import { obterPerfil, actualizarPerfil,eliminarPerfil } from '../controllers/perfil.js';

const router = express.Router();

router.post('/obterPerfil', obterPerfil);
router.put('/actualizar', actualizarPerfil);
router.delete('/eliminar', eliminarPerfil);

export default router;