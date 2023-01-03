
const administarPropiedades = (req, res) => {
    res.render("propiedades/admin", {
        pagina: "Mis Propiedades",
        barra: true
    });
}

const crearPropiedad = (req, res) => {
    res.render("propiedades/crear", {
        pagina: "Crear Propiedad",
        barra: true
    })
}

export { administarPropiedades, crearPropiedad }