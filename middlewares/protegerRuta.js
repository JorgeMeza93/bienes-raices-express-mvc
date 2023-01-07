import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";

const protegerRuta = async (req, res, next) => {
    //Verificar si hay un token
    const { _token } = req.cookies;
    if(! _token ){
        return res.redirect("/auth/login")
    }
    //Comprobar el token en cookies
    try {
        const decoded = jwt.verify(_token, process.env.JWT_PALABRA_SECRETA);
        const usuarioLogeado = await Usuario.scope("eliminarPassword").findByPk(decoded.id);
        console.log(usuarioLogeado);
        //Almacenar el usuario al Req
        if(usuarioLogeado){
            req.Usuario = usuarioLogeado;
        }
        else{
            return res.redirect("/auth/login")
        }
        return next();
    } catch (error) {
        return res.clearCookie("_token").redirect("/auth/login")
    }
}

export default protegerRuta;