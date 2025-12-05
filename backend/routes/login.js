import express from 'express';
import { loginUser } from '../controllers/login.js';

const router = express.Router();

// la ruta 

router.post("/", loginUser);
export default router;