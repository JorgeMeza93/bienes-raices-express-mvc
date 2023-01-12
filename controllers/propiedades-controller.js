//import Precio from "../models/Precio.js";
//import Categoria from "../models/Categoria.js";
import { Precio, Categoria, Propiedad } from "../models/index.js"
import { validationResult } from "express-validator";
import { unlink } from "node:fs/promises";

const administarPropiedades = async (req, res) => {
    const { id } = req.usuario;
    const propiedades = await Propiedad.findAll({
        where: {usuarioId: id},
        include: [
            {model: Categoria, as: "categoria"},
            {model: Precio, as: "precio"}
        ]
    });
    res.render("propiedades/admin", {
        pagina: "Mis Propiedades",
        barra: true,
        csrfToken: req.csrfToken(),
        propiedades
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

const guardarImagen = async (req, res) => {
    //Validar que la propiedad exista
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect("/mis-propiedades")
    }
    //Verificar que la propiedad no esté publicada
    if(propiedad.publicado){
        return res.redirect("/mis-propiedades");
    }
    //Validar que la propiedad no esté publicada
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString() ){
        return res.redirect("/mis-propiedades")
    }
    res.render("propiedades/agregar-imagen", {
        pagina: `Subir imagen: ${propiedad.titulo}`,
        barra: true,
        csrfToken: req.csrfToken(),
        propiedad
    });
}

const almacenarImagen = async (req, res, next) => {
    const {id} = req.params;
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect("/mis-propiedades");
    }
    if(propiedad.publicado){
        return res.redirect("/mis-propiedades");
    }
    // Verificar que la propiedad corresponda a la persona logeada
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect("/mis-propiedades");
    }
    try {
        // Almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1;
        await propiedad.save();
        next();
    } catch (error) {
        console.log(error);
    }
}
const editar = async (req, res) => {
    const { id } = req.params;
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect("/mis-propiedades");
    }
    // Verificar que quien visite el endpoint es el autor
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect("/mis-propiedades");
    }
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);
    res.render("propiedades/editar", {
        pagina: "Editar Propiedad",
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async(req, res) => {
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        return res.render("propiedades/editar", {
            pagina: "Editar Propiedad",
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect("/mis-propiedades");
    }
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect("/mis-propiedades");
    }
    try {
        const { titulo, descripcion, habitaciones, estacionamiento, banos, jardin, calle, lat, lng, precio, categoria } = req.body;
        propiedad.set({
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
        })
        await propiedad.save();
        res.redirect("/mis-propiedades")
    } catch (error) {
        
    }
}
const eliminar = async(req, response) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect("/mis-propiedades");
    }
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect("/mis-propiedades")
    }
    // Eliminar la imagen asociada
    await unlink(`public/uploads/${propiedad.imagen}`)
    console.log("Se eliminó la imagen");
    //Eliminar la propiedad
    await propiedad.destroy();
    res.redirect("/mis-propiedades")
}

const mostrarPropiedad = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model: Precio, as: "precio"},
            {model: Categoria, as: "categoria"}
        ]
    });
    if(!propiedad){
        return res.redirect("/404")
    }
    res.render("propiedades/mostrar", {
        propiedad,
        pagina: propiedad.titulo
    })
}

export { administarPropiedades, crearPropiedad, guardarPropiedad, guardarImagen, almacenarImagen, editar, guardarCambios, eliminar, mostrarPropiedad}