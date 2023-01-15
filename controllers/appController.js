import { Precio, Categoria, Propiedad } from "../models/index.js";

const inicio = async (req, res) => {
    const [categorias, precios] = await Promise.all([
        Categoria.findAll({ raw: true }),
        Precio.findAll()
    ])

    return res.render("inicio", {
        pagina: "Inicio",
        categorias,
        precios
    });
}

const categoria = (req, res) => {

}

const notFound404 = (req, res) => {

}

const buscador = (req, res) => {

}

export { inicio, categoria, notFound404, buscador}