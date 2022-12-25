import { Sequelize } from "sequelize";

const db = new Sequelize(process.env.BD_Nombre, process.env.BD_User, process.env.BD_Password, {
    host: process.env.BD_Host,
    port: 3306,
    dialect: "mysql",
    define: {
        timestamps: true
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});

export default db;