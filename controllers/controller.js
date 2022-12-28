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
        pagina: "Crea tu cuenta",
        csrfToken: req.csrfToken()
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
        return res.render("auth/registro", {
            pagina: "Crear Cuenta",
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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

const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({where: { token }});
    if(!usuario){
        return res.render("auth/confirmar-cuenta", {
            pagina: "Error al confirmar tu cuenta",
            mensaje: "Ha habido un error al confirmar tu cuenta. Intenta nuevamente",
            error: true
        })
    }
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    res.render("auth/confirmar-cuenta", {
        pagina: "Cuenta confirmada",
        mensaje: "La cuenta se confirmo correctamente"
    })
}

export { formularioLogin, formularioRegistro, formularioOlvidePassword, registrarUsuario, confirmar }