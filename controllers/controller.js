
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

export { formularioLogin, formularioRegistro }