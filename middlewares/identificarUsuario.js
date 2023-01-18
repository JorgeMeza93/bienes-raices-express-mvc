import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const identificarUsuario = async (req, res, next) => {
    // Identificar si hay un token en cookies
    const token = req.cookies._token;
    if(!token){
        req.usuario = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_PALABRA_SECRETA);
        const usuario = await Usuario.scope("eliminarPassword").findByPk(decoded.id);
        if(usuario) req.usuario = usuario;
        return next();
    } catch (error) {
        console.log(error);
        return res.clearCookie("_token").redirect("/auth/login");
    }
}

export default identificarUsuario;