import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator"

const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Accede a tu cuenta"
    })
}
const formularioRegistro = (req, res) => {
    res.render("auth/registro", {
        pagina: "Crea tu cuenta"
    })
}
const formularioOlvidePassword = (req, res) => {
    res.render("auth/olvide", {
        pagina: "Olvidé password"
    })
}

const registrarUsuario = async (req, res) => {
    //Validar campos del request
    await check("nombre").notEmpty().withMessage("El campo nombre no puede ir vacío").run(req);
    await check("apellido").notEmpty().withMessage("El campo apellido no puede ir vacío").run(req);
    await check("email").isEmail().withMessage("No es un formato válido de email").run(req);
    await check("password").isLength({ min: 8}).withMessage("El password debe ser de entre 8 y 24 caracteres").run(req);
    await check("repetir_password").equals(req.body.password).withMessage("Los passwords no son iguales").run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        console.log(req.body.password);
        console.log(req.body.repetir_password);
        return res.render("auth/registro", {
            pagina: "Crear Cuenta",
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email
            }
        })
    }

    const usuario = await Usuario.create( req.body );
    res.json(usuario)
}

export { formularioLogin, formularioRegistro, formularioOlvidePassword, registrarUsuario }