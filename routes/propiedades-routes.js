import express from "express";
import { administarPropiedades, crearPropiedad, guardarPropiedad } from "../controllers/propiedades-controller.js";
import { body } from "express-validator";
import protegerRuta from "../middlewares/protegerRuta.js";

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, administarPropiedades);
router.get("/propiedades/crear", protegerRuta, crearPropiedad);
router.post("/propiedades/crear", protegerRuta,
    body("titulo").notEmpty().withMessage("El título es un campo requerido"),
    body("descripcion").notEmpty().withMessage("La descripción es obligatoria").isLength({ max: 500 }).withMessage("La descripción es muy larga. Máximo 500 caracteres"),
    body("categoria").isNumeric().withMessage("Selecciona una categoría"),
    body("precio").isNumeric().withMessage("Selecciona un rango de precio"),
    body("habitaciones").isNumeric().withMessage("Selecciona habitaciones"),
    body("estacionamiento").isNumeric().withMessage("Selecciona lugares de estacionamiento"),
    body("banos").isNumeric().withMessage("Selecciona número de baños"),
    body("jardin").isNumeric().withMessage("Selecciona jardín"),
    body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
    guardarPropiedad)

export default router;