var express = require('express');
var router = express.Router();

var juegosRouter = require('./juegos/main');
var usuariosRouter = require('./usuarios/main');
var personas_juegosRouter = require('./personas_juegos/main');
var consultarColorRouter = require('./consultarColor/main');

//http://localhost:3203/api/juegos
router.use("/juegos",juegosRouter)

//http://localhost:3203/api/usuarios
router.use("/usuarios",usuariosRouter)

//http://localhost:3203/api/personas_juegos
router.use("/personas_juegos",personas_juegosRouter)

//http://localhost:3203/api/consultarColor
router.use("/consultarColor",consultarColorRouter)




module.exports = router;