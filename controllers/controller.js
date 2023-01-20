import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";
import { generarID, generarJWT } from "../helpers/token.js";
import { emailOlvidePassword, emailRegistro } from "../helpers/emails.js";
import bcrypt from "bcrypt";


const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Accede a tu cuenta",
        csrfToken: req.csrfToken()
    })
}
const autenticarLogin = async (req, res) => {
    await check("email").isEmail().withMessage("No tiene el formato válido de email").run(req);
    await check("password").notEmpty().withMessage("El password es requerido").run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res. render("auth/login", {
            pagina: "Intenta nuevamente",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: {email} });
    if(!usuario){
        return res.render("auth/login", {
            pagina: "Inicia Sesión",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "El usuario no existe" }]
        })
    }
    if(! usuario.confirmado){
        return res.render("auth/login", {
            pagina: "Inicia Sesión",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "Tu cuenta no ha sido confirmada"}]
        })
    }
    if(usuario.verificarPassword(password)){
        return res.render("auth/login", {
            pagina: "Inicia Sesión",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "El password es incorrecto" }]
        })
    }
    // Autenticar al usuario y generar jwt
   const token = generarJWT( { 
        id: usuario.id,
        nombre: usuario.nombre
    });

    return res.cookie("_token", token, {
        httpOnly: true,  // <-- Evita ataque csrf evita que este cookie sea accesible desde una api javascript (terminal)
        // secure: true   <-- Habilitar si tenemos en el hosting un certificado de ssl
    }).redirect("/mis-propiedades")
}

const formularioRegistro = (req, res) => {
    res.render("auth/registro", {
        pagina: "Crea tu cuenta",
        csrfToken: req.csrfToken()
    })
}
const formularioOlvidePassword = (req, res) => {
    res.render("auth/olvide", {
        pagina: "Olvidé password",
        csrfToken: req.csrfToken()
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

const resetPassword = async (req, res) => {
    await check("email").isEmail().withMessage("El email debe ser un formato válido").run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render("auth/olvide", {
            pagina: "Olvide password",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if(!usuario){
        return res.render("auth/olvide", {
            pagina: "Olvide password",
            csrfToken: req.csrfToken(),
            errores: [{msg: "El email no pertence a ningun usuario"}]
        })
    }
    usuario.token = generarID();
    await usuario.save();
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });
    res.render("templates/mensaje", {
        pagina: "Restablece tu password",
        mensaje: "Hemos enviado un email con las instrucciones"
    })
 
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } });
    if(!usuario){
        return res.render("auth/confirmar-cuenta", {
            pagina: "Restablece tu password",
            mensaje: "Ha habido un error al validar tu información, intenta nuevamente",
            error: true
        })
    }
    res.render("auth/restablece-password", {
        pagina: "Restablece tu password",
        mensaje: "",
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req, res) => {
    await check("password").isLength({ min: 8}).withMessage("El password debe ser de entre 8 y 24 caracteres").run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render("auth/restablece-password", {
            pagina: "Restablece tu password",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
    const { token } = req.params;
    const { password } = req.body;
    const usuario = await Usuario.findOne({ where: { token }});
    //Restablecer password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash( password, salt);
    usuario.token = null;
    await usuario.save();
    res.render("auth/confirmar-cuenta", {
        pagina: "Password Restablecido",
        mensaje: "El password se ha guardado correctamente"
    })
}
const cerrarSesion = (req, res) => {
    return res.clearCookie("_token").status(200).redirect("/auth/login");
}

export { formularioLogin, formularioRegistro, formularioOlvidePassword, registrarUsuario, confirmar, resetPassword, comprobarToken, nuevoPassword, autenticarLogin, cerrarSesion }