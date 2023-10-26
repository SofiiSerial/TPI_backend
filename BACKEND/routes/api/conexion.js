const mysql = require("mysql");
const conexion = mysql.createConnection({

    host:"ctpoba.ar",
    user:"serials",
    password:"45888226",
    database:"72_C"
})

conexion.connect();


module.exports = conexion;