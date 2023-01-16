import { Precio, Categoria, Propiedad } from "../models/index.js";

const inicio = async (req, res) => {
    const [categorias, precios, apartamentos, casas] = await Promise.all([
        Categoria.findAll({ raw: true }),
        Precio.findAll(),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                {
                    model: Precio,
                    as: "precio"
                }
            ],
            order: [["createdAt", "DESC"]]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [
                {
                    model: Precio,
                    as: "precio"
                }
            ],
            order: [["createdAt", "DESC"]]
        })
    ])

    return res.render("inicio", {
        pagina: "Inicio",
        categorias,
        precios,
        casas,
        apartamentos
    });
}

const categoria = (req, res) => {

}

const notFound404 = (req, res) => {

}

const buscador = (req, res) => {

}

export { inicio, categoria, notFound404, buscador}