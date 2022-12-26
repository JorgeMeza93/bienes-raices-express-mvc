import Usuario from "../models/Usuario.js"

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
    const usuario = await Usuario.create( req.body );
    res.json(usuario)
}

export { formularioLogin, formularioRegistro, formularioOlvidePassword, registrarUsuario }