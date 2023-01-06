import Precio from "../models/Precio.js";
import Categoria from "../models/Categoria.js";

const administarPropiedades = (req, res) => {
    res.render("propiedades/admin", {
        pagina: "Mis Propiedades",
        barra: true
    });
}

const crearPropiedad = async (req, res) => {
    //Consultar modelo de precio
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
    console.log(categorias);
    res.render("propiedades/crear", {
        pagina: "Crear Propiedad",
        barra: true,
        categorias,
        precios
    })
}

export { administarPropiedades, crearPropiedad }