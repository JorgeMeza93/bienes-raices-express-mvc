
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

export { formularioLogin, formularioRegistro, formularioOlvidePassword }