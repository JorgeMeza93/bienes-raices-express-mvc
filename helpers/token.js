import jwt  from "jsonwebtoken";

const generarID = () => {
    return Math.random().toString(32).substring(2) + Date.now().toString(32);
}

const generarJWT = (datos) => {
    return jwt.sign({
        id: datos.id,
        nombre: datos.nombre,
        fechaInicio: Date.now(),
    }, process.env.JWT_PALABRA_SECRETA, {
        expiresIn: "1d"
    })
}

export { generarID, generarJWT }