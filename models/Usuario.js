import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt"

const Usuario = db.define("usuarios", {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.STRING
}, {
    hooks: {
        beforeCreate: async function(usuario){
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
});

Usuario.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

export default Usuario;