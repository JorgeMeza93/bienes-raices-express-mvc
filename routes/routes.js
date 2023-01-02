import express from "express";
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrarUsuario, confirmar, resetPassword, comprobarToken, nuevoPassword, autenticarLogin } from "../controllers/controller.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.post("/login", autenticarLogin)
router.get("/registro", formularioRegistro);
router.post("/registro", registrarUsuario);
router.get("/olvide-password", formularioOlvidePassword),
router.post("/olvide-password", resetPassword)
router.get("/confirmar/:token", confirmar)
router.get("/olvide-password/:token", comprobarToken);
router.post("/olvide-password/:token", nuevoPassword);

export default router;