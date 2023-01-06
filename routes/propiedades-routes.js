import express from "express";
import { administarPropiedades, crearPropiedad, guardarPropiedad } from "../controllers/propiedades-controller.js";

const router = express.Router();

router.get("/mis-propiedades", administarPropiedades);
router.get("/propiedades/crear", crearPropiedad);
router.post("/propiedades/crear", guardarPropiedad)

export default router;