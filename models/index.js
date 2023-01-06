import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";

Precio.hasOne(Propiedad)

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}