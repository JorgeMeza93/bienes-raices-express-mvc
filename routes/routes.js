import express from "express";
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrarUsuario } from "../controllers/controller.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrarUsuario);
router.get("/olvide-password", formularioOlvidePassword)


export default router;