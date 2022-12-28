import express from "express";
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrarUsuario, confirmar } from "../controllers/controller.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrarUsuario);
router.get("/olvide-password", formularioOlvidePassword),
router.get("/confirmar/:token", confirmar)


export default router;