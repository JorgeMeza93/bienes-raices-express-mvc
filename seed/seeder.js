import categorias from "./categorias.js";
import Categoria from "../models/Categoria.js";
import db from "../config/db.js";
import precios from "./precios.js";
import Precio from "../models/Precio.js";

const importarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate();
        //Generar las columnas
        await db.sync();
        //Insertar los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ])
        console.log("Datos insertados correctamente");
        exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        await Promise.all([
            Categoria.destroy({where: {}, truncate: true }),
            Precio.destroy({ where: {}, truncate: true })
        ]);
        console.log("Datos eliminados correctamente");
        exit(0)
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2] === "-i"){
    importarDatos();
}
if(process.argv[2] === "-e"){
    eliminarDatos();
}

// "db:importar": "node ./seed/seeder.js -i"  <-- [2] = -i
