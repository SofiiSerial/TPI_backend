var express = require('express');
var router = express.Router();

var usuariosRouter = require('./usuarios/main');
var tipos_juegosRouter = require('./tipos_juegos/main');
var juegosRouter = require('./juegos/main');
var puntajesRouter = require('./puntajes/main');
var coloresRouter = require('./colores/main');


//http://localhost:3203/api/tipos_juegos
router.use("/tipos_juegos",tipos_juegosRouter)

//http://localhost:3203/api/usuarios
router.use("/usuarios",usuariosRouter)

//http://localhost:3203/api/juegos
router.use("/juegos",juegosRouter)

//http://localhost:3203/api/puntejes
router.use("/puntajes",puntajesRouter)

//http://localhost:3203/api/colores
router.use("/colores",coloresRouter)



module.exports = router;