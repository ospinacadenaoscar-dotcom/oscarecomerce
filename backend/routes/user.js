import express from 'express';
import {registrarUsers} from "../controllers/usercontrollers.js";


const router=express.Router();
router.post("/register", registrarUsers)


export default router;

