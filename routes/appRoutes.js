import express from "express";
import { inicio, categoria, notFound404, buscador } from "../controllers/appController.js"

const router = express.Router();

router.get("/", inicio);
router.get("/categorias/:id", categoria);
router.get("/404", notFound404);
router.post("/buscador", buscador);

export default router;