//import Precio from "../models/Precio.js";
//import Categoria from "../models/Categoria.js";
import { Precio, Categoria, Propiedad } from "../models/index.js"
import { validationResult } from "express-validator";


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
    res.render("propiedades/crear", {
        pagina: "Crear Propiedad",
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardarPropiedad = async (req, res) => {
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        return res.render("propiedades/crear", {
            pagina: "Crear Propiedad",
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }
    try {
        const { titulo, descripcion, habitaciones, estacionamiento, banos, jardin, calle, lat, lng, precio, categoria } = req.body;
        const { id: usuarioId } = req.usuario;
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            banos,
            jardin,
            calle,
            lat,
            lng,
            precioId: precio,
            categoriaId: categoria,
            usuarioId,
            imagen: ""
        })
        //recuperar el id de la propiedad
        const { id } = propiedadGuardada;
        res.redirect(`/propiedades/agregar-imagen/${id}`)
    } catch (error) {
        console.log(error);
    }
}

export { administarPropiedades, crearPropiedad, guardarPropiedad }