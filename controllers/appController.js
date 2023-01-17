import { Precio, Categoria, Propiedad } from "../models/index.js";
import { Sequelize } from "sequelize";

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
        apartamentos,
        csrfToken: req.csrfToken()
    });
}

const categoria = async (req, res) => {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id)
    if( !categoria ){
        return res.redirect("/404")
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
        propiedades,
        csrfToken: req.csrfToken()
    })
}

const notFound404 = (req, res) => {
    res.render("404", {
        pagina: "404 No Encontrada",
        csrfToken: req.csrfToken()
    })
}

const buscador = async (req, res) => {
    const { termino } = req.body;
    if(!termino.trim()){
        return res.redirect("back")
    }
    const propiedades = await Propiedad.findAll({
        where:{
            titulo:{
                [Sequelize.Op.like]: "%" + termino + "%"
            }
        },
        include: [
            {model: Precio, as: "precio"}
        ]
    })
    res.render("busqueda", {
        pagina: "Resultados de la búsqueda",
        propiedades,
        csrfToken: req.csrfToken()
    })
}

export { inicio, categoria, notFound404, buscador}