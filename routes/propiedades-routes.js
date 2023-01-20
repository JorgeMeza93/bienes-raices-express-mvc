import express from "express";
import { administarPropiedades, crearPropiedad, guardarPropiedad, guardarImagen, almacenarImagen, editar, guardarCambios, eliminar, mostrarPropiedad, enviarMensaje, verMensajes, cambiarEstado } from "../controllers/propiedades-controller.js";
import { body } from "express-validator";
import protegerRuta from "../middlewares/protegerRuta.js";
import upload from "../middlewares/subirImagen.js";
import identificarUsuario from "../middlewares/identificarUsuario.js"

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
    guardarPropiedad);
router.get("/propiedades/agregar-imagen/:id", protegerRuta, guardarImagen);
router.post("/propiedades/agregar-imagen/:id", protegerRuta, upload.single("imagen"), almacenarImagen );
router.get("/propiedades/editar/:id", protegerRuta, editar);
router.post("/propiedades/editar/:id", protegerRuta,
    body("titulo").notEmpty().withMessage("El título es un campo requerido"),
    body("descripcion").notEmpty().withMessage("La descripción es obligatoria").isLength({ max: 500 }).withMessage("La descripción es muy larga. Máximo 500 caracteres"),
    body("categoria").isNumeric().withMessage("Selecciona una categoría"),
    body("precio").isNumeric().withMessage("Selecciona un rango de precio"),
    body("habitaciones").isNumeric().withMessage("Selecciona habitaciones"),
    body("estacionamiento").isNumeric().withMessage("Selecciona lugares de estacionamiento"),
    body("banos").isNumeric().withMessage("Selecciona número de baños"),
    body("jardin").isNumeric().withMessage("Selecciona jardín"),
    body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
    guardarCambios);
router.post("/propiedades/eliminar/:id", protegerRuta, eliminar);
router.put("/propiedades/:id", protegerRuta, cambiarEstado);
// Área Pública
router.get("/propiedad/:id", identificarUsuario, mostrarPropiedad)
// Almacenar los mensajes de Propiedad
router.post("/propiedad/:id", identificarUsuario, body("mensaje").isLength({ min:10 }).withMessage("El Mensaje no puede ir vacío o es muy corto"), enviarMensaje),

router.get("/mensajes/:id", protegerRuta, verMensajes)

export default router;