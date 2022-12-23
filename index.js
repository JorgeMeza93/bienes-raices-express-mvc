import express from "express";
import router from "./routes/routes.js"

const app = express();
const port = 3000;

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