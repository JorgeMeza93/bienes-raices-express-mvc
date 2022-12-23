import express from "express";
import routes from "./routes/routes.js"

const app = express();
const port = 3000;

//Habilitar el temple engine
app.set("view engine", "pug");
app.set("views", "./views");

//Routing
app.use("/auth", routes);

app.listen(port, () =>{
    console.log(`Servidor corriendo en el puerto ${port}`)
})