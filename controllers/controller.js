import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";
import { generarID } from "../helpers/token.js";
import { emailRegistro } from "../helpers/emails.js";

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
    //Verificar que el usuario no esté duplicado
    const yaExiste = await Usuario.findOne({ where: {email: req.body.email } })
    if(yaExiste){
        console.log("Ya Existe");
        return res.render("auth/registro", {
            pagina: "Crear Cuenta",
            errores: [{ msg: "El usuario ya está registrado" }],
            usuario: {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email
            }
        })
    }
    //Almacenar un usuario
    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        password: req.body.password,
        token: generarID()
    });
    emailRegistro({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        token: usuario.token
    })

    res.render("templates/mensaje", {
        pagina: "Cuenta Creada Correctamente",
        mensaje: "Hemos enviado un email de confirmación presiona en el enlace"
    })
}

const confirmar = (req, res) => {
    const { token } = req.params;
    console.log("Comprobando");
}

export { formularioLogin, formularioRegistro, formularioOlvidePassword, registrarUsuario, confirmar }