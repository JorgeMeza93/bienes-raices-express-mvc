import express from "express";
import router from "./routes/routes.js"
import db from "./config/db.js";

const app = express();
const port = process.env.PORT || 3000;

//Conexión a la base de datos
try {
    await db.authenticate();
    db.sync();
    console.log("Conexion exitosa a la base de datos");
} catch (error) {
    
}

//Habilitar lectura de datos desde el request
app.use( express.urlencoded({ extended: true }) )

//Habilitar el temple engine
app.set("view engine", "pug");
app.set("views", "./views");

//Carpeta publica
app.use( express.static("public") )

//Routing
app.use("/auth", router);

app.listen(port, () =>{
    console.log(`Servidor corriendo en el puerto ${port}`)
})