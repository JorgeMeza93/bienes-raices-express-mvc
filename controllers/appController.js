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

const categoria = async (req, res) => {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id)
    if( !categoria ){
        return res.render("/404")
    }
    // Obtener las propiedades de categoria
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include: [
            {model: Precio, as: "precio"}
        ]
    })
    res.render("categoria", {
        pagina: `${categoria.nombre}s en Venta`,
        propiedades
    })
}

const notFound404 = (req, res) => {

}

const buscador = (req, res) => {

}

export { inicio, categoria, notFound404, buscador}