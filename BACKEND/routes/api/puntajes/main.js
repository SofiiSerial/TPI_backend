var express = require('express');
var router = express.Router();
var con = require('../conexion');

const rand = function(){
    return Math.random().toString(36).substr(2);
};

const getToken = function(){
    return rand() + rand ();

};

/*
    {id_juego, color1_id, color1_puntaje, color2_id, color2_puntaje, color3_id, color3_puntaje}

    funcion guardarPuntaje 
*/

module.exports = router;