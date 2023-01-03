import express from "express";
import { administarPropiedades, crearPropiedad } from "../controllers/propiedades-controller.js";

const router = express.Router();

router.get("/mis-propiedades", administarPropiedades);
router.get("/propiedades/crear", crearPropiedad);

export default router;